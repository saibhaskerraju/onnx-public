using System;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;

public class OnnxModel
{
    private InferenceSession _session;

    public OnnxModel(string modelPath)
    {
        _session = new InferenceSession(modelPath);
    }

    public float[] Predict(float[] input)
    {
        // Create a tensor from the input data
        var inputTensor = new DenseTensor<float>(input, new int[] { 1, input.Length });

        // Create an OnnxValue from the tensor
        var inputContainer = new List<NamedOnnxValue>
        {
            NamedOnnxValue.CreateFromTensor("input", inputTensor)
        };

        // Run the model
        using (var results = _session.Run(inputContainer))
        {
            // Extract the output tensor
            var output = results.First().AsTensor<float>().ToArray();
            return output;
        }
    }
}

class Program
{
    static void Main(string[] args)
    {
        // Path to the ONNX model
        string modelPath = "linear_regression_model.onnx";

        // Create an instance of the OnnxModel class
        var model = new OnnxModel(modelPath);

        // Example input data
        float[] inputData = new float[] { 5.5f };

        // Get predictions
        float[] predictions = model.Predict(inputData);

        // Print predictions
        Console.WriteLine("Predictions: " + string.Join(", ", predictions));
    }
}