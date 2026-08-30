export async function generateEmbedding(text) {
    const response = await fetch("http://127.0.0.1:8000/embed", { //in reference to the python code's request point and its server running location
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text
        })
    });

    if (!response.ok) {
        throw new Error(
            `Embedding service failed : Response status : ${response.status}`
        );
    }

    const data = await response.json();

    if (!Array.isArray(data.embedding)) {
        throw new Error("Embedding service returned an invalid embedding");
    }

    if (data.embedding.length !== 768) {
        throw new Error(
            `Invalid embedding dimensions: expected 768, received ${data.embedding.length}`
        );
    }

    return data.embedding;

}