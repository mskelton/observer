const animation = "mskelton-selector-observer"

function slugify(str: string) {
  return str
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
}

function registerAnimation() {
  const style = document.createElement("style")
  style.innerHTML = `@keyframes ${animation} {}`
  document.head.append(style)
}

const getListener =
  (seenMark: string, selector: string, callback: (node: HTMLElement) => void) =>
  (event: AnimationEvent) => {
    const target = event.target as HTMLElement
    if (target.classList.contains(seenMark) || !target.matches(selector)) {
      return
    }

    // Removes this specific selector’s animation once it was seen
    target.classList.add(seenMark)
    callback(target)
  }

export function observe(
  selector: string,
  listener: (node: HTMLElement) => void,
) {
  registerAnimation()

  const seenMark = `mskelton-seen-${slugify(selector)}`
  const rule = document.createElement("style")

  rule.textContent = `
    :where(${selector}):not(.${seenMark}) {
      animation: 1ms ${animation};
    }
  `

  document.body.prepend(rule)
  window.addEventListener(
    "animationstart",
    getListener(seenMark, selector, listener),
  )
}
