# An Xin Portfolio / 安馨个人作品集

An English-first bilingual portfolio for interaction design, cultural technology, digital products and HCI research.

## Local development

```bash
pnpm install
pnpm dev
```

## Production check

```bash
pnpm build
```

## Media

Original images and videos remain in `public/media/`. The site displays responsive WebP images and compressed MP4 files from `public/optimized/`; the graphic design viewer keeps a link to the original image. To rebuild the web versions after adding or changing source media:

```bash
python -m pip install -r scripts/requirements-media.txt
python scripts/build-optimized-media.py
pnpm build
```

The generator also updates `src/optimizedMedia.json`. Commit the new optimized files and manifest with the source media before pushing.

## Publishing

The public address is `https://xinan-annie.github.io/`. Pushing to `main` builds and deploys through GitHub Actions.
