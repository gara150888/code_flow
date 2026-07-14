"use server";

import { HTTPError, ParseError, StreamError } from "@/module/gpt/error";

const config = (message: string) => ({
    endpoint: "https://chataifree.co.uk/wp-admin/admin-ajax.php?action=pro_chat_send&nonce=b172d718be",
    headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.6",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Brave\";v=\"150\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "cookie": "ext_name=ojplmecpdpgccookcobabopnaifgidhf; _lscache_vary=3ed637b7c5e7865261bb6feea39ea87d",
        "Referer": "https://chataifree.co.uk/"
    },
    body: {
        model: "gpt-4.1-nano",
        messages: [
            {
                role: "system",
                content: [
                    { type: "text", text: "Answer the following question in osho style and in hinglish in short." }
                ]
            },
            {
                role: "user",
                content: [
                    { type: "text", text: message ?? "Which AI model are you?" }
                ]
            }
        ],
    },
});

const parse = function* (line: string) {
    try {
        if (!line || line === "[DONE]") return;
        yield JSON.parse(line).choices?.[0]?.delta?.content;
    } catch (e) {
        throw new ParseError(line, { cause: e });
    }
};

export async function* stream(message: string) {
    const { endpoint, headers, body } = config(message);

    const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });

    if (!res.ok) throw new HTTPError(res);
    if (!res.body) throw new StreamError("Response body is empty.");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() ?? "";

            for (const line of lines)
                if (line.startsWith("data:"))
                    yield* parse(line.slice(5).trim());
        }

        if (buffer.startsWith("data:"))
            yield* parse(buffer.slice(5).trim());

    } finally {
        reader.releaseLock();
    }
}
