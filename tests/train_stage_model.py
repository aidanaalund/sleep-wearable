from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
import joblib


def train_stage(X, y, out_dir):
    model = Pipeline([
        ("imputer", SimpleImputer()),
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=500, class_weight="balanced")),
    ])

    model.fit(X, y)
    joblib.dump(model, out_dir / "stage_model.joblib")
    return model