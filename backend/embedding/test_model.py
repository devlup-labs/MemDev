from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-base-en-v1.5")

text = "React useEffect cleanup runs when an effect is rerun or a component unmounts."

embedding = model.encode(text)

print("Dimensions:", len(embedding))
print("First 5 values:", embedding[:5])