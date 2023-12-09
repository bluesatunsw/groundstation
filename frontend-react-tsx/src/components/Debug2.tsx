import { twMerge } from 'tailwind-merge'

/**
 * A simple component for displaying a chunk of stringified JSON
 * for debugging
 */
type DebugProps = {
  children: string | object | undefined
  className?: string
}

export const Debug = (props: DebugProps) => {
  let { children, className } = props
  if (typeof children === 'object') children = JSON.stringify(children, null, 2)
  const classes = twMerge('mt-5 h-48 rounded-md border-2 border-base-200 bg-base-100 p-5 text-xs', className)
  return (
    <div className={classes}>
      <pre className="h-full overflow-y-scroll break-words font-mono text-base-content">{children}</pre>
    </div>
  )
}
