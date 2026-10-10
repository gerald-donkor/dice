"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ShuffleIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useId, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { createBot } from "@/actions/bot"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { botInsertSchema, type BotInsert } from "@/db/schema"

const presets = [
  {
    name: "Ada",
    job: "Research assistant",
    instructions:
      "Answer briefly, cite sources, and ask before running anything destructive.",
  },
  {
    name: "Linus",
    job: "Code reviewer",
    instructions:
      "Review code for bugs, security issues, and readability. Explain your suggestions and ask before making changes.",
  },
  {
    name: "Quinn",
    job: "Writing editor",
    instructions:
      "Improve clarity, grammar, and flow while preserving my voice. Explain significant edits.",
  },
  {
    name: "Sage",
    job: "Tutor",
    instructions:
      "Explain concepts step by step, use examples, and ask questions to check my understanding.",
  },
] as const

function BotForm({ onCreated }: { onCreated: () => void }) {
  const id = useId()
  const [avatarSeed] = useState(() => nanoid())
  const [preset, setPreset] = useState<string[]>([])
  const form = useForm<BotInsert>({
    resolver: zodResolver(botInsertSchema),
    defaultValues: {
      name: "",
      avatar: avatarSeed,
      job: "",
      instructions: "",
    },
  })
  const { isSubmitting } = form.formState

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const bot = await createBot(values)
      toast.add({ title: `${bot.name} is ready.`, type: "success" })
      onCreated()
    } catch {
      toast.add({
        title: "Couldn't create your bot.",
        description: "Please try again.",
        type: "error",
      })
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <FieldSet disabled={isSubmitting}>
        <ToggleGroup
          aria-label="Bot templates"
          variant="outline"
          size="sm"
          className="flex-wrap"
          value={preset}
          onValueChange={(value) => {
            setPreset(value)
            const selected = presets.find((item) => item.job === value[0])
            if (!selected) return

            form.setValue("name", selected.name, {
              shouldDirty: true,
              shouldValidate: true,
            })
            form.setValue("job", selected.job, {
              shouldDirty: true,
              shouldValidate: true,
            })
            form.setValue("instructions", selected.instructions, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }}
        >
          {presets.map((item) => (
            <ToggleGroupItem
              key={item.job}
              value={item.job}
              type="button"
              className="rounded-full"
              disabled={isSubmitting}
            >
              {item.job}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <FieldGroup>
          <Controller
            name="avatar"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Field orientation="horizontal">
                  <ChatAvatar seed={field.value ?? avatarSeed} />
                  <FieldContent>
                    <FieldTitle id={`${id}-face`}>Face</FieldTitle>
                    <FieldDescription>
                      Shuffle until you find one you like.
                    </FieldDescription>
                  </FieldContent>
                  <Button
                    ref={field.ref}
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-describedby={`${id}-face`}
                    aria-invalid={fieldState.invalid}
                    onBlur={field.onBlur}
                    onClick={() => field.onChange(nanoid())}
                  >
                    <ShuffleIcon data-icon="inline-start" />
                    Shuffle
                  </Button>
                </Field>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
                <Input
                  {...field}
                  id={`${id}-name`}
                  placeholder="Ada"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? `${id}-name-error` : undefined
                  }
                />
                <FieldError
                  id={`${id}-name-error`}
                  errors={[fieldState.error]}
                />
              </Field>
            )}
          />
          <Controller
            name="job"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-job`}>Job</FieldLabel>
                <Input
                  {...field}
                  id={`${id}-job`}
                  placeholder="Research assistant"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? `${id}-job-error` : undefined
                  }
                />
                <FieldError
                  id={`${id}-job-error`}
                  errors={[fieldState.error]}
                />
              </Field>
            )}
          />
          <Controller
            name="instructions"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${id}-instructions`}>
                  How it should work
                </FieldLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  id={`${id}-instructions`}
                  placeholder={presets[0].instructions}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? `${id}-instructions-error` : undefined
                  }
                />
                <FieldError
                  id={`${id}-instructions-error`}
                  errors={[fieldState.error]}
                />
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>
          Cancel
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          Create bot
        </Button>
      </DialogFooter>
    </form>
  )
}

export function BotDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="secondary" />}>
        <PlusIcon data-icon="inline-start" />
        Create a new bot
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New bot</DialogTitle>
          <DialogDescription>
            Give it a face, a name, and a job to do.
          </DialogDescription>
        </DialogHeader>
        <BotForm onCreated={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
