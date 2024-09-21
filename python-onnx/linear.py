import torch
import torch.nn as nn
import torch.optim as optim

# Define a simple linear regression model
class LinearRegressionModel(nn.Module):
    def __init__(self):
        super(LinearRegressionModel, self).__init__()
        self.linear = nn.Linear(1, 1)

    def forward(self, x):
        return self.linear(x)

# Create a dataset
x_train = torch.tensor([[1.0], [2.0], [3.0], [4.0]], dtype=torch.float32)
y_train = torch.tensor([[2.0], [4.0], [6.0], [8.0]], dtype=torch.float32)

# Initialize the model, loss function, and optimizer
model = LinearRegressionModel()
criterion = nn.MSELoss()
optimizer = optim.SGD(model.parameters(), lr=0.01)

# Train the model
num_epochs = 1000
for epoch in range(num_epochs):
    # Forward pass
    outputs = model(x_train)
    loss = criterion(outputs, y_train)

    # Backward pass and optimization
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if (epoch+1) % 100 == 0:
        print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')

# Save the trained model
torch.save(model.state_dict(), 'linear_regression_model.pth')


# PART - 2 ============ Convert the model to ONNX format ============


import torch.onnx

# Load the trained model
model = LinearRegressionModel()
model.load_state_dict(torch.load('linear_regression_model.pth'))
model.eval()

# Define a dummy input
dummy_input = torch.tensor([[1.0]], dtype=torch.float32)

# Export the model to ONNX format
torch.onnx.export(model, dummy_input, 'linear_regression_model.onnx', 
                  input_names=['input'], output_names=['output'])

print("Model has been converted to ONNX format and saved as 'linear_regression_model.onnx'")