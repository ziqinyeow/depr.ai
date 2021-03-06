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
  const tokenizer = await loadTokenizer();

  const model_1 = "./model/emotion.onnx";
  const model_2 = "./model/depression.onnx";

  const emotion = await ort.InferenceSession.create(model_1, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
  });
  const depression = await ort.InferenceSession.create(model_2, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
  });

  // lm_inference(tokenizer, session, "testing");
  return { tokenizer, emotion, depression };
};

const EMOJI_DEFAULT_DISPLAY = [
  ["Emotion", "Score"],
  ["admiration ๐", 0],
  ["amusement ๐", 0],
  ["neutral ๐", 0],
  ["approval ๐", 0],
  ["joy ๐", 0],
  ["gratitude ๐", 0],
];

const EMOJIS = [
  "admiration ๐",
  "amusement ๐",
  "anger ๐ก",
  "annoyance ๐",
  "approval ๐",
  "caring ๐ค",
  "confusion ๐",
  "curiosity ๐ค",
  "desire ๐",
  "disappointment ๐",
  "disapproval ๐",
  "disgust ๐คฎ",
  "embarrassment ๐ณ",
  "excitement ๐คฉ",
  "fear ๐จ",
  "gratitude ๐",
  "grief ๐ข",
  "joy ๐",
  "love โค๏ธ",
  "nervousness ๐ฌ",
  "optimism ๐ค",
  "pride ๐",
  "realization ๐ก",
  "relief๐",
  "remorse ๐",
  "sadness ๐",
  "surprise ๐ฒ",
  "neutral ๐",
];

const DEPRESSION = ["non-depression", "depression"];

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

async function lm_inference(
  tokenizer: any,
  emotion: any,
  depression: any,
  text: any
) {
  try {
    const encoded_ids = await tokenizer.tokenize(text);

    if (encoded_ids.length === 0) {
      return [0.0, EMOJI_DEFAULT_DISPLAY];
    }
    const model_input = create_model_input(encoded_ids);

    // emotion
    const emotion_start = performance.now();
    const emotion_output = await emotion.run(model_input, ["output_0"]);
    const emotion_duration = (performance.now() - emotion_start).toFixed(1);

    const emotion_probs = emotion_output["output_0"].data
      .map(sigmoid)
      .map((t: any) => Math.floor(t * 100));

    const emotion_result = [];
    for (var i = 0; i < EMOJIS.length; i++) {
      const t = [EMOJIS[i], emotion_probs[i]];
      emotion_result[i] = t;
    }
    emotion_result.sort(sortResult);

    const emotion_result_list = [];
    emotion_result_list[0] = ["Emotion", "Score"];
    for (i = 0; i < 6; i++) {
      emotion_result_list[i + 1] = emotion_result[i];
    }

    // depression
    const depression_start = performance.now();
    const depression_output = await depression.run(model_input, ["output_0"]);
    const depression_duration = (performance.now() - depression_start).toFixed(
      1
    );

    const depression_probs = depression_output["output_0"].data
      .map(sigmoid)
      .map((t: any) => Math.floor(t * 100));

    const depression_result = [];
    for (var i = 0; i < DEPRESSION.length; i++) {
      const t = [DEPRESSION[i], depression_probs[i]];
      depression_result[i] = t;
    }
    depression_result.sort(sortResult);

    const depression_result_list = [];
    depression_result_list[0] = ["Depression", "Score"];
    for (i = 0; i < 2; i++) {
      depression_result_list[i + 1] = depression_result[i];
    }

    return {
      emotion: [emotion_duration, emotion_result_list],
      depression: [depression_duration, depression_result_list],
    };
  } catch (e) {
    return { emotion: [0.0, EMOJI_DEFAULT_DISPLAY] };
  }
}

export let load = download;
export let inference = lm_inference;
export let columnNames = EMOJI_DEFAULT_DISPLAY;
