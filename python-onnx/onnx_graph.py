import onnx

# Load the ONNX model
model = onnx.load("linear_regression_model.onnx")

# Get the model's graph
graph = model.graph

# Print input details
print("Inputs:")
for input in graph.input:
    print(f"Name: {input.name}")
    print(f"Shape: {[dim.dim_value for dim in input.type.tensor_type.shape.dim]}")
    print(f"Type: {input.type.tensor_type.elem_type}")

# Print output details
print("\nOutputs:")
for output in graph.output:
    print(f"Name: {output.name}")
    print(f"Shape: {[dim.dim_value for dim in output.type.tensor_type.shape.dim]}")
    print(f"Type: {output.type.tensor_type.elem_type}")