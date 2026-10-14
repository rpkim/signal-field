import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import JSZip from "jszip";
import colors from "@/data/colors.json";
import density from "@/data/density.json";
import typeData from "@/data/type.json";
import {
  buildKitDesignMd,
  buildKitReadme,
  buildThemeCss,
  buildTokensCss,
} from "@/lib/exportKit";
import type { ColorItem, DensityItem, MixState, TypeItem } from "@/lib/types";

function byId<T extends { id: string }>(list: T[], id: string) {
  return list.find((x) => x.id === id) ?? list[0];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { mix?: MixState; name?: string };
    if (!body.mix?.color || !body.mix?.type || !body.mix?.density) {
      return NextResponse.json({ error: "mix required" }, { status: 400 });
    }
    const mix = body.mix;
    const color = byId(colors.items as ColorItem[], mix.color);
    const type = byId(typeData.items as TypeItem[], mix.type);
    const dens = byId(density.items as DensityItem[], mix.density);

    const systemDesign = await readFile(
      path.join(process.cwd(), "content", "design.md"),
      "utf8"
    );

    const zip = new JSZip();
    // Primary three
    zip.file("SIGNAL-FIELD-design.md", systemDesign);
    zip.file("design.md", systemDesign); // alias for the name users ask for
    zip.file("tokens.css", buildTokensCss(mix, color, type, dens));
    zip.file("theme.css", buildThemeCss());
    // Extras
    zip.file("DESIGN.md", buildKitDesignMd(mix, color, type, dens));
    zip.file("README.md", buildKitReadme(mix));
    zip.file(
      "mix.json",
      JSON.stringify(
        {
          name: body.name || `${mix.color}-${mix.type}-${mix.density}`,
          exportedAt: new Date().toISOString(),
          mix,
        },
        null,
        2
      ) + "\n"
    );

    const buffer = await zip.generateAsync({ type: "uint8array" });
    const slug = (body.name || `${mix.color}-${mix.type}`)
      .toLowerCase()
      .replace(/[^\w]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48);

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="signal-field-kit-${slug || "export"}.zip"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
