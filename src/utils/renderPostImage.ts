import path from "node:path";
import { loadDefaultJapaneseParser } from "budoux";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";
import type { AstroPostEntry } from "../content.config";
import { fetchGoogleFont } from "./fetchGoogleFont";

const parser = loadDefaultJapaneseParser();

export const POST_IMAGE_WIDTH = 1200;
export const POST_IMAGE_HEIGHT = 630;

/**
 * frontmatterの`imageUrl`で指定された画像を読み込む
 *
 * @param imageUrl `/public/`から始まるパス、またはhttp(s)のURL
 */
const loadImage = async (imageUrl: string): Promise<Buffer | string> => {
	if (imageUrl.startsWith("http")) {
		const res = await fetch(imageUrl);
		if (!res.ok) {
			throw new Error(`failed to fetch image: ${imageUrl} (${res.status})`);
		}
		return Buffer.from(await res.arrayBuffer());
	}
	if (imageUrl.startsWith("/public/")) {
		return path.join(process.cwd(), imageUrl);
	}
	throw new Error(
		`unsupported imageUrl: ${imageUrl} (must start with "/public/" or "http")`,
	);
};

/**
 * タイトルを記載したサムネ画像のSVGを生成する
 */
const renderTitleImage = async (title: string) => {
	const words = parser.parse(title);

	// see: https://og-playground.vercel.app/?share=lZMxb5tAFMe_ytNlsStTG-JYMootxVJbdemULXg44AGXHHfoOIoRYnCGqkOnLh2rTt3ypVClfowekMZO6w5lgLvjvR___3uPmgQyROKS0RhWa6g9ARBIkWvQTHOEFXhkw1GEqNr9wxuUKWpVvTM5ebv_vlGUiehFcNfef_7x8PXnt0_t_kt7_7Hdf_CIJzqYQl0oAaPLkL0HXa48UlpRwTkkwyPiuIPMmoPGnbZuziilW4ik0JYvedhRwFzTKeS64mjSfRrcxUoWInyb0hhdzgRSZcWKhgyFHtnnFyHGEzhbLuezzcYsFrY9X9jj36wBVNfwJ8lY_Q8YNE3HWw_Qg73eUHezAsmhx2NoOeDHxp3jOFt4XoBsZy0gq6y5Rx5Zf9H60iyP3gNghakU8mUqEW4Ox5d5RsWQ-VjPq6vXG2e-fZYMYLomj7KmXdpRwPZJyNQoOSHruHlMY5pbgSkXqkGqfXHo4HBSJibKaKj7qWr-he15t0WuWVRZZuhOOV8_eecyPqXzsB5WY080ZEJkppkZbOLWpGShTohrO7PZhCTI4kQTd3FuNiH6RUzciPIcJ8R85pZdV1n3f-iy3xlQZ-1V6mNIXK0KbCZEU99EXFPGS2ZEj3CXoWKpqQjlY9L8Ag
	const out = html(
		`<div tw="w-full h-full flex p-38px text-[#aaa] font-bold" style="backgroundImage:linear-gradient(135deg, #9940BB, #611461)">
	<div tw="flex flex-col justify-between rounded-4 bg-[#222] w-full h-full px-6 py-4 overflow-hidden">
		<div tw="flex flex-shrink-0 text-9">
		eyemono.moe [
			<span tw="text-[#AAFB24]">
				info
			</span>
		]
		</div>
		<div tw="flex flex-1 items-center overflow-hidden">
			<div tw="flex flex-wrap text-17 font-bold text-white">
          ${words
						.map((word) => `<span tw="block text-ellipsis">${word}</span>`)
						.join("")}
			</div>
		</div>
		<div tw="flex flex-shrink-0 justify-end text-9">
			> eyemono.log
		</div>
	</div>
</div>`,
	);

	const svg = await satori(out, {
		fonts: [
			{
				name: "Noto Sans JP",
				data: await fetchGoogleFont("Noto+Sans+JP", 600),
				style: "normal",
			},
		],
		height: POST_IMAGE_HEIGHT,
		width: POST_IMAGE_WIDTH,
	});

	return Buffer.from(svg);
};

/**
 * 記事のサムネ画像(1200:630)を生成する
 *
 * `imageUrl`が指定されていればその画像をリサイズ・クロップし、
 * 未指定ならタイトルを記載した画像を生成する
 *
 * @param entry 対象の記事
 * @param width 出力画像の幅
 */
export const renderPostImage = async (
	entry: AstroPostEntry,
	width = POST_IMAGE_WIDTH,
) => {
	const source = entry.data.imageUrl
		? await loadImage(entry.data.imageUrl)
		: await renderTitleImage(entry.data.title);

	return sharp(source).resize(
		width,
		Math.round((width * POST_IMAGE_HEIGHT) / POST_IMAGE_WIDTH),
		{ fit: "cover" },
	);
};
