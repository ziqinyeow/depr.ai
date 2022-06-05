/** */
/*global BigInt */
/*global BigInt64Array */

import { loadTokenizer } from "./bert_tokenizer";

//Setup onnxruntime
const ort = require("onnxruntime-web");
//requires Cross-Origin-*-policy headers https://web.dev/coop-coep/
ort.env.wasm.numThreads = 3;
ort.env.wasm.simd = true;

// const options = {
//   executionProviders: ["wasm"],
//   graphOptimizationLevel: "all",
// };

const download = async () => {
  const model = "./model/emotion.onnx";
  const tokenizer = await loadTokenizer();
  const session = await ort.InferenceSession.create(model, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
  });

  // lm_inference(tokenizer, session, "testing");
  return { tokenizer, session };
};

const EMOJI_DEFAULT_DISPLAY = [
  ["Emotion", "Score"],
  ["admiration 👏", 0],
  ["amusement 😂", 0],
  ["neutral 😐", 0],
  ["approval 👍", 0],
  ["joy 😃", 0],
  ["gratitude 🙏", 0],
];

const EMOJIS = [
  "admiration 👏",
  "amusement 😂",
  "anger 😡",
  "annoyance 😒",
  "approval 👍",
  "caring 🤗",
  "confusion 😕",
  "curiosity 🤔",
  "desire 😍",
  "disappointment 😞",
  "disapproval 👎",
  "disgust 🤮",
  "embarrassment 😳",
  "excitement 🤩",
  "fear 😨",
  "gratitude 🙏",
  "grief 😢",
  "joy 😃",
  "love ❤️",
  "nervousness 😬",
  "optimism 🤞",
  "pride 😌",
  "realization 💡",
  "relief😅",
  "remorse 😞",
  "sadness 😞",
  "surprise 😲",
  "neutral 😐",
];

function sortResult(a: any, b: any) {
  if (a[1] === b[1]) {
    return 0;
  } else {
    return a[1] < b[1] ? 1 : -1;
  }
}

function sigmoid(t: Number) {
  return 1 / (1 + Math.pow(Math.E, -t));
}

function create_model_input(encoded: any) {
  var input_ids = new Array(encoded.length + 2);
  var attention_mask = new Array(encoded.length + 2);
  var token_type_ids = new Array(encoded.length + 2);
  input_ids[0] = BigInt(101);
  attention_mask[0] = BigInt(1);
  token_type_ids[0] = BigInt(0);
  var i = 0;
  for (; i < encoded.length; i++) {
    input_ids[i + 1] = BigInt(encoded[i]);
    attention_mask[i + 1] = BigInt(1);
    token_type_ids[i + 1] = BigInt(0);
  }
  input_ids[i + 1] = BigInt(102);
  attention_mask[i + 1] = BigInt(1);
  token_type_ids[i + 1] = BigInt(0);
  const sequence_length = input_ids.length;
  input_ids = new ort.Tensor("int64", BigInt64Array.from(input_ids), [
    1,
    sequence_length,
  ]);
  attention_mask = new ort.Tensor("int64", BigInt64Array.from(attention_mask), [
    1,
    sequence_length,
  ]);
  token_type_ids = new ort.Tensor("int64", BigInt64Array.from(token_type_ids), [
    1,
    sequence_length,
  ]);
  return {
    input_ids: input_ids,
    attention_mask: attention_mask,
    token_type_ids: token_type_ids,
  };
}

async function lm_inference(tokenizer: any, session: any, text: any) {
  try {
    const encoded_ids = await tokenizer.tokenize(text);

    if (encoded_ids.length === 0) {
      return [0.0, EMOJI_DEFAULT_DISPLAY];
    }
    const model_input = create_model_input(encoded_ids);
    const start = performance.now();
    const output = await session.run(model_input, ["output_0"]);

    const duration = (performance.now() - start).toFixed(1);
    //const sequence_length = model_input['input_ids'].size;
    //console.log("Inference latency = " + duration + "ms, sequence_length=" + sequence_length);
    const probs = output["output_0"].data
      .map(sigmoid)
      .map((t: any) => Math.floor(t * 100));

    const result = [];
    for (var i = 0; i < EMOJIS.length; i++) {
      const t = [EMOJIS[i], probs[i]];
      result[i] = t;
    }
    result.sort(sortResult);

    const result_list = [];
    result_list[0] = ["Emotion", "Score"];
    for (i = 0; i < 6; i++) {
      result_list[i + 1] = result[i];
    }
    return [duration, result_list];
  } catch (e) {
    console.log(e);

    return [0.0, EMOJI_DEFAULT_DISPLAY];
  }
}

export let load = download;
export let inference = lm_inference;
export let columnNames = EMOJI_DEFAULT_DISPLAY;
