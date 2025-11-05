import Sandbox from "@e2b/code-interpreter";

export async function getSandbox(id) {
    const sandbox = Sandbox.connect(id)
    await sandbox.setTimeout(60_000 * 10)

    return sandbox
}
export function lastAssistantTextMessageContent(result) {
    const lastAssistantTextMessageIndex = result.output.findLastIndex(
        (message) => message.role === "assistant"
    )

    const message = result.output[lastAssistantTextMessageIndex]
    return message?.content ? typeof message.content === "string" ? message.content : message.content[0]?.text : ""
}