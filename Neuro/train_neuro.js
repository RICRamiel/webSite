let inputLayerNeuronsNumber = 784;
let hiddenLayerNeuronsNumber = 350;
let outputLayerNeuronsNumber = 10;
let learning_rate = 0.1;

function sigmoid(x){
    return (1 / (1 + Math.exp(-x)));
}

function sigmoidDerivative(x){
    return x * (1 - x);
}

//self.hidden_weights = np.random.randn(hiddenLayerNeuronsNumber, inputLayerNeuronsNumber) * np.sqrt(2 / inputLayerNeuronsNumber)
let hidden_bias = new Array(hiddenLayerNeuronsNumber);
for (let i = 0; i < hiddenLayerNeuronsNumber; i++){
    hidden_bias[i] = [0];
}

let output_weights = new Array(outputLayerNeuronsNumber);
for (let i = 0; i < outputLayerNeuronsNumber; i++){
    output_weights[i] = new Array(hiddenLayerNeuronsNumber);
    for (let j =0; j < hiddenLayerNeuronsNumber; j++){
        output_weights[i][j] = Math.random();
    }
}

let output_bias = new Array(outputLayerNeuronsNumber);
for (let i = 0; i < outputLayerNeuronsNumber; i++){
    output_bias[i] = [0];
}

function np_dot(mtx1, mtx2){
    let res = new Array(mtx1.length);
    for (let i = 0; i < mtx1.length;i++){
        res[i] = new Array(mtx2[0].length);
        for (let j = 0; j < mtx2[0].length; j ++){
            res[i][j] = 0;
            for (let k = 0; k<mtx1[0].length;k ++){
                res[i][j] += mtx1[i][k] * mtx2[k][j];
            }
        }
    }
    return res;
}

function np_sum(mtx1, mtx2){
    for (let i = 0; i < mtx1.length; i ++){
        for (let j =0; j < mtx1[0].length; j++){
            mtx1[i][j] += mtx2[i][j];
        }
    }
    return mtx1;
}
function np_minus(mtx1, mtx2){
    for (let i = 0; i < mtx1.length; i ++){
        for (let j =0; j < mtx1[0].length; j++){
            mtx1[i][j] -= mtx2[i][j];
        }
    }
    return mtx1;
}

function sigmoidForMTX(mtx){
    let res = mtx.map(function(elem) {
        return elem.map(function(num) {
            return sigmoid(num);
        });
    });
    return res;
}

function train(inputs, desired_output){
    /*let hidden_layer_in = np_sum(np_dot(hidden_weights, inputs), hidden_bias);
    let hidden_layer_out = sigmoidForMTX(hidden_layer_in);

    let output_layer_in = np_sum(np_dot(output_weights, hidden_layer_out), output_bias);
    let predicted_output = sigmoidForMTX(output_layer_in);

    let error = np_minus(desired_output, predicted_output);*/

}

/*def train(self, inputs, desired_output):
hidden_layer_in = np.dot(self.hidden_weights, inputs) + self.hidden_bias
hidden_layer_out = sigmoid(hidden_layer_in) # сигма скрытого

output_layer_in =  np.dot(self.output_weights, hidden_layer_out) + self.output_bias
predicted_output = sigmoid(output_layer_in) # сигма выходного

error = desired_output - predicted_output
d_predicted_output = error * sigmoid_derivative(predicted_output)

error_hidden_layer = d_predicted_output.T.dot(self.output_weights)
d_hidden_layer = error_hidden_layer.T * sigmoid_derivative(hidden_layer_out)

self.output_weights += hidden_layer_out.dot(d_predicted_output.T).T * self.learning_rate
self.output_bias += np.sum(d_predicted_output, axis=0, keepdims=True) * self.learning_rate

self.hidden_weights += inputs.dot(d_hidden_layer.T).T * self.learning_rate
self.hidden_bias += np.sum(d_hidden_layer, axis=0, keepdims=True) * self.learning_rate
# self.loss.append(loss(predicted_output, desired_output))




function predict(inputs){
    let hidden_layer_in = np_sum(np_dot(hidden_weights, inputs), hidden_bias);
    let hidden_layer_out = sigmoidForMTX(hidden_layer_in);

    let output_layer_in = np_sum(np_dot(output_weights, hidden_layer_out), output_bias);
    let predicted_output = sigmoidForMTX(output_layer_in);

    return predicted_output;
}*/

fetch('./mnist/test.js')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let mnist_test = data;
    });

let mnist_train;
let mnist_test;

function f1(){

}


for (let i in mnist_train){
    let inputs = i.image;

    let desired_output = new Array(10);
    desired_output[i.label] = 1;

    train(inputs, desired_output);
}

let correct_counter = 0;
for (let i = 0; i < 10000; i ++){
    let prediction_list = predict(mnist_test[i].image);
    let out_index = prediction_list.indexOf(Math.max(...prediction_list));
    if (out_index === mnist_test[i].label){
        correct_counter ++;
    }
}

let accuracy = correct_counter / 10000;

console.log("Accuracy is : ", accuracy * 100, " %");

/*
import numpy as np
from mlxtend.data import loadlocal_mnist

# np.dot - скалярное произведение массивов
# np.exp - Вычислите экспоненту всех элементов входного массива.
# amax - Возвращает максимум массива или максимум вдоль оси.
    def sigmoid(x):
return 1 / (1 + np.exp(-x))


def sigmoid_derivative(x):
return x * (1 - x)


# def loss(predicted_output, desired_output):
#     return 1 / 2 * (desired_output - predicted_output) ** 2


class NeuralNetwork():
def __init__(self, inputLayerNeuronsNumber, hiddenLayerNeuronsNumber, outputLayerNeuronsNumber):
self.inputLayerNeuronsNumber = inputLayerNeuronsNumber
self.hiddenLayerNeuronsNumber = hiddenLayerNeuronsNumber
self.outputLayerNeuronsNumber = outputLayerNeuronsNumber
self.learning_rate = 0.1
# He initialization
self.hidden_weights = np.random.randn(hiddenLayerNeuronsNumber, inputLayerNeuronsNumber) * np.sqrt(2 / inputLayerNeuronsNumber)
self.hidden_bias = np.zeros([hiddenLayerNeuronsNumber, 1])
self.output_weights = np.random.randn(outputLayerNeuronsNumber, hiddenLayerNeuronsNumber)
self.output_bias = np.zeros([outputLayerNeuronsNumber, 1])
# self.loss = []

def train(self, inputs, desired_output):
hidden_layer_in = np.dot(self.hidden_weights, inputs) + self.hidden_bias
hidden_layer_out = sigmoid(hidden_layer_in) # сигма скрытого

output_layer_in =  np.dot(self.output_weights, hidden_layer_out) + self.output_bias
predicted_output = sigmoid(output_layer_in) # сигма выходного

error = desired_output - predicted_output
d_predicted_output = error * sigmoid_derivative(predicted_output)

error_hidden_layer = d_predicted_output.T.dot(self.output_weights)
d_hidden_layer = error_hidden_layer.T * sigmoid_derivative(hidden_layer_out)

self.output_weights += hidden_layer_out.dot(d_predicted_output.T).T * self.learning_rate
self.output_bias += np.sum(d_predicted_output, axis=0, keepdims=True) * self.learning_rate

self.hidden_weights += inputs.dot(d_hidden_layer.T).T * self.learning_rate
self.hidden_bias += np.sum(d_hidden_layer, axis=0, keepdims=True) * self.learning_rate
# self.loss.append(loss(predicted_output, desired_output))

def predict(self, inputs):
hidden_layer_in = np.dot(self.hidden_weights, inputs) + self.hidden_bias
hidden_layer_out = sigmoid(hidden_layer_in)
output_layer_in = np.dot(self.output_weights, hidden_layer_out) + self.output_bias
predicted_output = sigmoid(output_layer_in)
return predicted_output


# Importing dataset
X, y = loadlocal_mnist(images_path='C:/Users/Sonya/Downloads/mnist/train-images.idx3-ubyte',
    labels_path='C:/Users/Sonya/Downloads/mnist/train-labels.idx1-ubyte')

print(X[0])

# Spliting dataset
num_train = 50000
num_test = 10000
X_train = X[:num_train, :] / 255
y_train = np.zeros((num_train, 10))
y_train[np.arange(0, num_train), y[:num_train]] = 1

X_test = X[num_train:, :] / 255
y_test = np.zeros((num_test, 10))
y_test[np.arange(0, num_test), y[y.size - num_test:]] = 1

print("Training set shape : ", X_train.shape)
print("Test set shape : ", X_test.shape)

nn = NeuralNetwork(784, 350, 10)

for i in range(X_train.shape[0]):
inputs = np.array(X_train[i, :].reshape(-1, 1))
desired_output = np.array(y_train[i, :].reshape(-1, 1))
nn.train(inputs, desired_output)

prediction_list = []
for i in range(X_test.shape[0]):
inputs = np.array(X_test[i].reshape(-1, 1))
prediction_list.append(nn.predict(inputs))

correct_counter = 0
for i in range(len(prediction_list)):
out_index = np.where(prediction_list[i] == np.amax(prediction_list[i]))[0][0]

if y_test[i][out_index] == 1:
correct_counter += 1

accuracy = correct_counter / num_test

print("Accuracy is : ", accuracy * 100, " %")
# print(nn.hidden_weights)
# print(nn.output_weights)
# print(nn.hidden_bias)*/
