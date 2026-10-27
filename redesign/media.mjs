#!/usr/bin/env node
/*
 * VibeForce's generated media: fal stills, then fal image-to-video, then the encodes the site serves.
 *
 *   COMMANDAGI_ENV_ROOT=<folder with .env> FFMPEG=<ffmpeg with libaom/libx264> node redesign/media.mjs [shot …]
 *
 * The key is read from SVC__FAL__MAIN__API_KEY (the env, or <COMMANDAGI_ENV_ROOT>/.env*) and never printed or written.
 * fal's originals stay in redesign/.src/ (not committed); a shot whose original exists is not generated again, so a
 * rerun costs nothing. Every request is appended to redesign/media-log.json with its model, prompt and price.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");
const SRC = join(HERE, ".src");
const OUT = join(SITE, "media");
const LOG = join(HERE, "media-log.json");
const FFMPEG = process.env.FFMPEG || "ffmpeg";

const STILL = { model: "fal-ai/nano-banana-pro", price: 0.15 };
const MOTION = { model: "fal-ai/kling-video/v2.5-turbo/pro/image-to-video", perSecond: 0.07 };

// Art direction shared by the stills: cold daylight, concrete greys, one hi-vis colour, nobody's face, no readable text.
const LOOK = "Documentary photograph, 35mm, natural cold daylight, muted concrete greys and deep forest green, a single hi-vis lime-yellow accent, crisp detail, slight film grain, no faces visible, no readable text, no logos, no watermark. Fictional, not a real company or event.";
const SHOTS = [
  {
    id: "yard", seconds: "10",
    still: `Straight top-down aerial view of a bare concrete loading yard at early morning. Painted lime-yellow floor lines and empty hatched bays. One field operator in a hi-vis lime vest and dark work trousers walks diagonally across the frame carrying a black hard case, a long low shadow behind them. A forest-green shipping container cuts the right edge. Lots of empty concrete. ${LOOK}`,
    motion: "Locked-off top-down camera. The operator walks slowly across the yard from lower left to upper right, the shadow follows, nothing else moves. Calm, steady, real time.",
  },
  {
    id: "proof", seconds: "5",
    still: `Close-up at waist height inside a warehouse: two hands in grey work gloves hold a phone level, photographing a stretch-wrapped pallet of plain cardboard boxes. The phone's screen shows the pallet. A hi-vis lime sleeve cuff. Cold overhead light, a forest-green steel rack soft in the background. ${LOOK}`,
    motion: "Slow handheld push towards the pallet, the hands steady the phone, a small tap on the screen as the photo is taken. Gentle, no cuts.",
  },
  {
    id: "route", seconds: "5",
    still: `Street-level view at dusk of a wet empty crossroads in an unnamed industrial district, low warehouses, a plain white unmarked van parked at the kerb, its rear doors open. Sodium street light, a hi-vis lime vest folded on the van floor. Wide, quiet, cinematic. ${LOOK}`,
    motion: "Very slow dolly forward towards the open van, light rain glints on the asphalt, a street light flickers on once. No people, no traffic.",
  },
];

function key() {
  if (process.env.SVC__FAL__MAIN__API_KEY) return process.env.SVC__FAL__MAIN__API_KEY;
  const root = process.env.COMMANDAGI_ENV_ROOT;
  if (!root) throw Error("set COMMANDAGI_ENV_ROOT to the folder whose .env holds SVC__FAL__MAIN__API_KEY");
  for (const f of readdirSync(root).filter((f) => f.startsWith(".env") && !f.includes("example"))) {
    const m = readFileSync(join(root, f), "utf8").match(/^SVC__FAL__MAIN__API_KEY=["']?([^"'\n]+)/m);
    if (m) return m[1];
  }
  throw Error("no SVC__FAL__MAIN__API_KEY in the .env cascade");
}

const log = existsSync(LOG) ? JSON.parse(readFileSync(LOG, "utf8")) : [];
const record = (row) => { log.push({ at: new Date().toISOString(), ...row }); writeFileSync(LOG, JSON.stringify(log, null, 2) + "\n"); };

async function fal(model, input) {
  const auth = { Authorization: `Key ${key()}`, "Content-Type": "application/json" };
  const sub = await fetch(`https://queue.fal.run/${model}`, { method: "POST", headers: auth, body: JSON.stringify(input) });
  const job = await sub.json();
  if (!sub.ok) throw Error(`fal ${model} ${sub.status}: ${JSON.stringify(job).slice(0, 300)}`);
  for (;;) {
    await new Promise((r) => setTimeout(r, 4000));
    const st = await (await fetch(job.status_url, { headers: auth })).json();
    if (st.status === "COMPLETED") break;
    if (st.status !== "IN_QUEUE" && st.status !== "IN_PROGRESS") throw Error(`fal ${model}: ${JSON.stringify(st).slice(0, 300)}`);
  }
  const res = await fetch(job.response_url, { headers: auth });
  const body = await res.json();
  if (!res.ok) throw Error(`fal ${model} result ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
  return { id: job.request_id, body };
}

async function download(url, to) {
  const r = await fetch(url);
  if (!r.ok) throw Error(`download ${r.status}`);
  writeFileSync(to, Buffer.from(await r.arrayBuffer()));
}

const ff = (...a) => execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...a], { stdio: "inherit" });

// The grade: a little less colour, lifted blacks towards forest green, grain. The loop is 1280 wide, muted, no audio.
const GRADE = "scale=1280:-2:flags=lanczos,eq=saturation=0.78:contrast=1.06,colorbalance=rs=-0.03:gs=0.02:bs=-0.01,noise=alls=7:allf=t";

async function shot(s) {
  const still = join(SRC, `${s.id}.png`), clip = join(SRC, `${s.id}.mp4`);
  let stillUrl = null;
  if (!existsSync(still)) {
    const { id, body } = await fal(STILL.model, { prompt: s.still, aspect_ratio: "16:9", num_images: 1, output_format: "png" });
    stillUrl = body.images[0].url;
    await download(stillUrl, still);
    record({ shot: s.id, kind: "still", model: STILL.model, requestId: id, prompt: s.still, usd: STILL.price });
  }
  if (!existsSync(clip)) {
    const image_url = stillUrl ?? `data:image/png;base64,${readFileSync(still).toString("base64")}`;
    const { id, body } = await fal(MOTION.model, { prompt: s.motion, image_url, duration: s.seconds, negative_prompt: "text, logo, watermark, faces, cuts, fast motion, flashing" });
    await download(body.video.url, clip);
    record({ shot: s.id, kind: "video", model: MOTION.model, requestId: id, prompt: s.motion, seconds: Number(s.seconds), usd: MOTION.perSecond * Number(s.seconds) });
  }
  mkdirSync(OUT, { recursive: true });
  ff("-i", clip, "-an", "-vf", GRADE, "-c:v", "libaom-av1", "-crf", "40", "-b:v", "0", "-cpu-used", "6", "-row-mt", "1", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(OUT, `${s.id}.av1.mp4`));
  ff("-i", clip, "-an", "-vf", GRADE, "-c:v", "libx264", "-crf", "29", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(OUT, `${s.id}.mp4`));
  // The poster is the clip's first frame, graded like the clip, so the swap to video does not jump.
  ff("-i", join(OUT, `${s.id}.mp4`), "-frames:v", "1", "-c:v", "libwebp", "-quality", "72", join(OUT, `${s.id}.webp`));
  ff("-i", join(OUT, `${s.id}.mp4`), "-frames:v", "1", "-vf", "scale=640:-2", "-c:v", "libwebp", "-quality", "60", join(OUT, `${s.id}-640.webp`));
  console.log(`${s.id}: done`);
}

mkdirSync(SRC, { recursive: true });
const want = process.argv.slice(2);
await Promise.all(SHOTS.filter((s) => !want.length || want.includes(s.id)).map(shot));
const spent = log.reduce((a, r) => a + (r.usd || 0), 0);
console.log(`fal spent so far: $${spent.toFixed(2)}`);
