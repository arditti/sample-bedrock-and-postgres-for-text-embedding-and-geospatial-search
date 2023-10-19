import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
// Hard coded us-east-1 for now. as bedrock is not available in every region
const client = new BedrockRuntimeClient({region: 'us-east-1'});
// todo: switch body type string to BlobPayloadInputTypes
export type TModelBody = string;
export const invokeModel = async (body: TModelBody, modelId: string) => {
    const input = { // InvokeModelRequest
        body: body,
        contentType: 'application/json',
        accept: 'application/json',
        modelId: modelId,
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    return response
}