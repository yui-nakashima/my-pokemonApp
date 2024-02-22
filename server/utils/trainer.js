import { ListObjectsCommand, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client";

// コマンド参考
// https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html

const config = useRuntimeConfig();

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

/** トレーナーの一覧の取得 */
export const findTrainers = async () => {
  const objects = await s3Client.send(
    new ListObjectsCommand({ Bucket: config.bucketName }),
  );
  return objects.Contents ?? [];
};

/** トレーナーの取得 */
// TODO: トレーナーを取得する S3 クライアント処理の実装
export const findTrainer = async (trainerName) => {
  const object = await s3Client.send(
    new GetObjectCommand({ Bucket: config.bucketName, Key: trainerName + ".json" }),
  );
  const trainer = JSON.parse(await streamToString(object.Body));
  return trainer;
};

/** トレーナーの追加更新 */
/** AWS s3にデータをアップロードする */
export const upsertTrainer = async (name, trainer) => {
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucketName, // バケット名
      Key: `${name}.json`,       // ファイル名
      Body: JSON.stringify({ name: "", pokemons: [], ...trainer }),
    }),
  );
  return result;
};

/** トレーナーの削除 */
// TODO: トレーナーを削除する S3 クライアント処理の実装
export const DeleteTrainer = async (name) => {
  const result = await s3Client.send(
    new DeleteObjectCommand({ Bucket: config.bucketName, Key: `${name}.json` }),
  );
  console.log(result);
  return result;
};