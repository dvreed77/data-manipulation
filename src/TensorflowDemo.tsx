import { useEffect } from "react";

import * as tf from "@tensorflow/tfjs";
import { VegaChart } from "./VegaChart";

function createModel() {
  // Create a sequential model
  const model = tf.sequential();

  // Add a single input layer
  model.add(tf.layers.dense({ inputShape: [2], units: 1, useBias: true }));

  // Add an output layer
  model.add(tf.layers.dense({ units: 1, useBias: true }));

  return model;
}

async function getData2(): Promise<D2[]> {
  const demoDataResponse = await fetch("/TS_demo_data.csv");

  const demoData = (await demoDataResponse.text()).split("\n").filter(Boolean);

  //   const header = demoData[0].split(",");
  const rawData = demoData.slice(1).map((row) => row.split(","));

  return rawData.map((row) => ({
    date: new Date(row[0]),
    feature_1: Number(row[1]),
    feature_2: Number(row[2]),
    sales: Number(row[3]),
  }));
}

type D2 = {
  date: Date;
  feature_1: number;
  feature_2: number;
  sales: number;
};

function convertToTensor2(data: D2[]) {
  // Wrapping these calculations in a tidy will dispose any
  // intermediate tensors.

  return tf.tidy(() => {
    // Step 1. Shuffle the data
    // tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map((d) => [d.feature_1, d.feature_2]);
    const labels = data.map((d) => d.sales);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 2]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
  });
}

async function trainModel(model: any, inputs: any, labels: any) {
  // Prepare the model for training.
  model.compile({
    // optimizer: tf.train.adam(),
    optimizer: tf.train.rmsprop(0.001),
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"],
  });

  const batchSize = 32;
  const epochs = 1;

  console.log(inputs);

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    // shuffle: true,
    // callbacks: tfvis.show.fitCallbacks(
    //   { name: "Training Performance" },
    //   ["loss", "mse"],
    //   { height: 200, callbacks: ["onEpochEnd"] }
    // ),
  });
}

function normalizeInputs(inputs: [number, number][], normalizationData: any) {
  const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

  const inputTensor = tf.tensor2d(inputs, [inputs.length, 2]);
  const normalizedInputs = inputTensor
    .sub(inputMin)
    .div(inputMax.sub(inputMin));

  return normalizedInputs;
}

function testModel(
  model: any,
  inputData: [number, number][],
  normalizationData: any
) {
  const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

  // Generate predictions for a uniform range of numbers between 0 and 1;
  // We un-normalize the data by doing the inverse of the min-max scaling
  // that we did earlier.
  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100);
    // const preds = model.predict(xs.reshape([100, 2]));

    const preds = model.predict(normalizeInputs(inputData, normalizationData));

    const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin);

    const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin);

    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });

  //   const predictedPoints = Array.from(xs).map((val, i) => {
  //     return { x: val, y: preds[i] };
  //   });

  //   const originalPoints = inputData.map((d) => ({
  //     x: d.horsepower,
  //     y: d.mpg,
  //   }));

  //   tfvis.render.scatterplot(
  //     { name: "Model Predictions vs Original Data" },
  //     {
  //       values: [originalPoints, predictedPoints],
  //       series: ["original", "predicted"],
  //     },
  //     {
  //       xLabel: "Horsepower",
  //       yLabel: "MPG",
  //       height: 300,
  //     }
  //   );

  //   return { predictedPoints };
  return preds;
}

async function runTF() {
  const data2 = await getData2();

  console.log("ddd", data2);
  //   const data = await getData();

  const model = createModel();

  const tensorData = convertToTensor2(data2);
  const { inputs, labels } = tensorData;

  // Train the model
  await trainModel(model, inputs, labels);
  console.log("Done Training");

  const inputData: [number, number][] = [
    [1, 18],
    [2, 2],
    [3, 3],
  ];

  const preds = testModel(model, inputData, tensorData);

  console.log(inputData[0], preds[0]);
  //   const d = model.predict(
  //     tf.tensor2d([
  //       [1, 1],
  //       [2, 2],
  //       [3, 3],
  //     ])
  //   );

  //   console.log(d);
  //   tfvis.render.scatterplot(
  //     { name: "Horsepower v MPG" },
  //     { values },
  //     {
  //       xLabel: "Horsepower",
  //       yLabel: "MPG",
  //       height: 300,
  //     }
  //   );

  //   console.log(cars);
}

export const TensorflowDemo = () => {
  useEffect(() => {
    runTF();
  }, []);
  return (
    <div>
      <VegaChart />
    </div>
  );
};
