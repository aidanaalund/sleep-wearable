def fuse(stage_probs, sleep_probs, margin=0.1, thresh=0.5):
    wake = stage_probs["Wake"]
    n1 = stage_probs["N1"]

    if abs(wake - n1) <= margin and (wake + n1) >= 0.5:
        return "N1" if sleep_probs["asleep"] >= thresh else "Wake"

    return max(stage_probs, key=stage_probs.get)