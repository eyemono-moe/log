import { type CollectionEntry, getEntry } from "astro:content";
import { Resvg } from "@resvg/resvg-js";
import type { APIRoute } from "astro";
import satori from "satori";
import { html } from "satori-html";
import { fetchGoogleFont } from "../../libs/fetchGoogleFont";
import { getPosts } from "../../libs/getPost";

export async function getStaticPaths() {
	const blogEntries = await getPosts();
	return blogEntries.map((entry) => ({
		params: { id: entry.id },
		props: { entry },
	}));
}

const height = 630;
const width = 1200;

export const GET: APIRoute<{ entry: CollectionEntry<"posts"> }> = async ({
	params,
	props,
}) => {
	const { id } = params;
	if (!id) {
		return new Response("Not Found", { status: 404 });
	}
	const { entry } = props;

	const post = await getEntry(entry.collection, id);
	if (!post) {
		return new Response("Not Found", { status: 404 });
	}

	// see: https://og-playground.vercel.app/?share=lZMxb5tAFMe_ytNlsStTG-JYMootxVJbdemULXg44AGXHHfoOIoRYnCGqkOnLh2rTt3ypVClfowekMZO6w5lgLvjvR___3uPmgQyROKS0RhWa6g9ARBIkWvQTHOEFXhkw1GEqNr9wxuUKWpVvTM5ebv_vlGUiehFcNfef_7x8PXnt0_t_kt7_7Hdf_CIJzqYQl0oAaPLkL0HXa48UlpRwTkkwyPiuIPMmoPGnbZuziilW4ik0JYvedhRwFzTKeS64mjSfRrcxUoWInyb0hhdzgRSZcWKhgyFHtnnFyHGEzhbLuezzcYsFrY9X9jj36wBVNfwJ8lY_Q8YNE3HWw_Qg73eUHezAsmhx2NoOeDHxp3jOFt4XoBsZy0gq6y5Rx5Zf9H60iyP3gNghakU8mUqEW4Ox5d5RsWQ-VjPq6vXG2e-fZYMYLomj7KmXdpRwPZJyNQoOSHruHlMY5pbgSkXqkGqfXHo4HBSJibKaKj7qWr-he15t0WuWVRZZuhOOV8_eecyPqXzsB5WY080ZEJkppkZbOLWpGShTohrO7PZhCTI4kQTd3FuNiH6RUzciPIcJ8R85pZdV1n3f-iy3xlQZ-1V6mNIXK0KbCZEU99EXFPGS2ZEj3CXoWKpqQjlY9L8Ag
	const out = html`<div tw="w-full h-full flex p-38px text-[#aaa] font-bold" style="backgroundImage:linear-gradient(135deg, #9940BB, #611461)">
    <div tw="flex flex-col rounded-4 bg-[#222] w-full h-full px-6 py-4">
      <div tw="flex text-9">
        eyemono.moe [
        <span tw="text-[#AAFB24]">
          info
        </span>
        ]
      </div>
      <div tw="h-full flex items-center text-15 font-bold text-white">${post.data.title}</div>
      <div tw="flex justify-end text-9">
        > eyemono.log
      </div>
    </div>
  </div>`;

	const svg = await satori(out, {
		fonts: [
			{
				name: "Noto Sans JP",
				data: await fetchGoogleFont("Noto+Sans+JP", 600),
				style: "normal",
			},
		],
		height,
		width,
	});

	const resvg = new Resvg(svg, {
		font: {
			loadSystemFonts: false,
		},
		fitTo: {
			mode: "width",
			value: width,
		},
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
