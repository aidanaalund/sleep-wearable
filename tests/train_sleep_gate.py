def train_sleep_gate(X, y, out_dir):
    model = Pipeline([
        ("imputer", SimpleImputer()),
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=300, class_weight="balanced")),
    ])

    model.fit(X, y)
    joblib.dump(model, out_dir / "sleep_gate.joblib")
    return model