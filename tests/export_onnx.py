from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType


def export_onnx(model, n_features, path):
    onnx_model = convert_sklearn(model, initial_types=[("input", FloatTensorType([None, n_features]))])
    with open(path, "wb") as f:
        f.write(onnx_model.SerializeToString())