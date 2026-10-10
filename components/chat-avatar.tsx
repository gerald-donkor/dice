import { Avatar, Style } from "@dicebear/core"
import clay from "@dicebear/styles/clay.json" with { type: "json" }
import gaze from "@dicebear/styles/gaze.json" with { type: "json" }
import marbles from "@dicebear/styles/marbles.json" with { type: "json" }
import { cn } from "cn"
import Image from "next/image"

// Mix Marbles' sphere with Gaze's eyes and Clay's animated accessories and texture.
const chatStyle = new Style({
  ...marbles,
  canvas: {
    ...marbles.canvas,
    elements: [
      {
        type: "element",
        name: "g",
        attributes: { class: "dbga-hop" },
        children: [
          {
            type: "element",
            name: "g",
            attributes: { class: "dbcl-c" },
            children: [
              ...marbles.canvas.elements.map((element) =>
                element.type === "component" && element.name === "eyes"
                  ? {
                      type: "element",
                      name: "g",
                      attributes: { class: "dbga-look" },
                      children: [
                        {
                          type: "component",
                          name: "spacing",
                          attributes: { transform: "translate(20 42)" },
                        },
                      ],
                    }
                  : element
              ),
              {
                type: "component",
                name: "pattern",
                attributes: { transform: "translate(35 75)" },
              },
            ],
          },
        ],
      },
      { type: "component", name: "animation" },
      { type: "component", name: "clayAnimation" },
    ],
  },
  components: {
    ...marbles.components,
    top: {
      ...marbles.components.top,
      variants: {
        ...marbles.components.top.variants,
        ...Object.fromEntries(
          Object.entries(clay.components.top.variants).map(
            ([name, variant]) => [
              `clay${name}`,
              {
                ...variant,
                elements: [
                  {
                    type: "element",
                    name: "g",
                    attributes: { transform: "translate(26 6)" },
                    children: [
                      {
                        type: "element",
                        name: "g",
                        attributes: { class: "dbcl-t" },
                        children: variant.elements,
                      },
                    ],
                  },
                ],
              },
            ]
          )
        ),
      },
    },
    pattern: clay.components.pattern,
    eyes: gaze.components.eyes,
    spacing: gaze.components.spacing,
    animation: gaze.components.animation,
    clayAnimation: clay.components.animation,
  },
  colors: {
    ...marbles.colors,
    body: marbles.colors.sphere,
    accent: clay.colors.accent,
    glint: gaze.colors.glint,
  },
})

// Reuse Clay's squash motion while preserving Marbles' own artwork.
const marblesStyle = new Style({
  ...marbles,
  canvas: {
    ...marbles.canvas,
    elements: [
      {
        type: "element",
        name: "g",
        attributes: { class: "dbcl-c" },
        children: marbles.canvas.elements,
      },
      { type: "component", name: "animation" },
    ],
  },
  components: {
    ...marbles.components,
    animation: clay.components.animation,
  },
})

const avatarStyles = {
  combined: chatStyle,
  gaze: new Style(gaze),
  marbles: marblesStyle,
  clay: new Style(clay),
}

type ChatAvatarStyle = keyof typeof avatarStyles

type ChatAvatarProps = {
  seed: string
  style?: ChatAvatarStyle
  animated?: boolean
  className?: string
}

function ChatAvatar({
  seed,
  style = "combined",
  animated = false,
  className,
}: ChatAvatarProps) {
  const animationVariant = animated ? "medium" : "none"
  const src = new Avatar(avatarStyles[style], {
    seed,
    animationVariant: [animationVariant],
    ...(style === "combined" && { clayAnimationVariant: [animationVariant] }),
  }).toDataUri()

  return (
    <Image
      src={src}
      alt="Chat avatar"
      width={32}
      height={32}
      className={cn("size-8 shrink-0 rounded-full", className)}
      unoptimized
    />
  )
}

export { ChatAvatar, type ChatAvatarProps, type ChatAvatarStyle }
