import * as v from 'valibot'

const RequiredStringSchema = v.pipe(v.string(), v.nonEmpty())

const MediaSchema = v.variant('kind', [
  v.strictObject({
    kind: v.literal('image'),
    src: RequiredStringSchema,
    alt: RequiredStringSchema,
  }),
  v.strictObject({
    kind: v.literal('audio'),
    src: RequiredStringSchema,
    label: RequiredStringSchema,
  }),
  v.strictObject({
    kind: v.literal('video'),
    src: RequiredStringSchema,
    label: RequiredStringSchema,
  }),
])

const RectSchema = v.strictObject({
  kind: v.literal('rect'),
  x: v.pipe(v.number(), v.finite()),
  y: v.pipe(v.number(), v.finite()),
  w: v.pipe(
    v.number(),
    v.finite(),
    v.check((value) => value > 0, 'Width must be greater than zero.'),
  ),
  h: v.pipe(
    v.number(),
    v.finite(),
    v.check((value) => value > 0, 'Height must be greater than zero.'),
  ),
})

export const DeckNoteSchema = v.variant('type', [
  v.strictObject({
    id: RequiredStringSchema,
    type: v.literal('prompt_response'),
    prompt: RequiredStringSchema,
    answer: RequiredStringSchema,
    media: v.array(MediaSchema),
  }),
  v.strictObject({
    id: RequiredStringSchema,
    type: v.literal('cloze'),
    text: v.pipe(
      RequiredStringSchema,
      v.regex(/\{\{[^:}]+::[^}]+\}\}/, 'A cloze marker is required.'),
    ),
    media: v.array(MediaSchema),
  }),
  v.strictObject({
    id: RequiredStringSchema,
    type: v.literal('occlusion'),
    image: v.strictObject({
      src: RequiredStringSchema,
      alt: RequiredStringSchema,
    }),
    masks: v.pipe(
      v.array(
        v.strictObject({
          id: RequiredStringSchema,
          answer: RequiredStringSchema,
          shape: RectSchema,
        }),
      ),
      v.minLength(1),
      v.check(
        (masks) => new Set(masks.map((mask) => mask.id)).size === masks.length,
        'Mask IDs must be unique.',
      ),
    ),
  }),
])

export type DeckNote = v.InferOutput<typeof DeckNoteSchema>
