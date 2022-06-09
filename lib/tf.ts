import * as tf from "@tensorflow/tfjs";

let model: any;

const class_names = [
  [
    "Normal",
    "Mild Depression",
    "Moderate Depression",
    "Severe Depression",
    "Extremely Severe Depression",
  ],
  ["Non-depressed", "Depressed"],
];

export const loadModel = async (url: string) => {
  model = await tf.loadGraphModel(url);
  // let test = await model.predict(tf.tensor([[0, 0, 0, 0, 0, 0, 0, 0, 0, 4]]));
  // test = test.dataSync();
  // test = tf.tensor1d(test).argMax().dataSync();
  // test = class_names[test];
  // console.log(test);
  return model;
};

export const predict = async (input: any, type: number) => {
  try {
    let tensor = tf.tensor(input);

    // console.log(tensor.dataSync());

    let pred_probs = await model.predict(tensor);
    pred_probs = pred_probs.dataSync();
    // console.log(pred_probs);
    const pred = tf.tensor1d(pred_probs).argMax().dataSync();
    //   class_names[pred];
    // console.log(class_names[pred]);
    // @ts-ignore
    return { class: class_names[type][pred], pred };
  } catch (error: any) {
    console.log(error.message);
  }
};
