import onnx

model = onnx.load("meditation_model_fw.onnx")
graph = model.graph

# Find ZipMap node
zipmap_node = None
for node in graph.node:
    if node.op_type == "ZipMap":
        zipmap_node = node
        break

if zipmap_node is None:
    raise Exception("No ZipMap found")

# The tensor BEFORE ZipMap (this is what you want)
new_output_name = zipmap_node.input[0]

print("Replacing output with:", new_output_name)

# Remove ZipMap node
graph.node.remove(zipmap_node)

# Replace graph outputs
del graph.output[:]

new_output = onnx.helper.make_tensor_value_info(
    new_output_name,
    onnx.TensorProto.FLOAT,
    None  # let ONNX infer shape
)

graph.output.append(new_output)

# (optional but recommended) fix model
model = onnx.shape_inference.infer_shapes(model)

onnx.save(model, "meditation_model_final.onnx")

print("Fixed model saved")