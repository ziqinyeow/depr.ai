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
  // let test = await model.predict(
  //   tf.tensor([
  //     [
  //       2, 1, 2, 3, 2, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
  //       0, 0, 0, 1, 0, 0,
  //     ],
  //   ])
  // );
  // test = test.dataSync();
  // if (type === 0) {
  //   test = tf.tensor1d(test).argMax().dataSync();
  // } else if (type === 1) {
  //   test = tf.tensor1d(test).sigmoid().dataSync();
  //   if (test > 0.5) {
  //     test = 1;
  //   } else {
  //     test = 0;
  //   }
  // }

  // test = class_names[1][test];
  // console.log(test);
  return model;
};

export const predict = async (input: any, type: number) => {
  try {
    let tensor = tf.tensor(input);

    // console.log(tensor.dataSync());

    let pred_probs = await model.predict(tensor);
    let pred = pred_probs.dataSync();

    if (type === 0) {
      pred = tf.tensor1d(pred).argMax().dataSync();
    } else if (type === 1) {
      pred = tf.tensor1d(pred).sigmoid().dataSync();
      if (pred > 0.5) {
        pred = 1;
      } else {
        pred = 0;
      }
    }
    // @ts-ignore
    return { class: class_names[type][pred], pred };
  } catch (error: any) {
    console.log(error.message);
  }
};
