import site from '../content/site.json'

const FORM_EMAIL = site.email || 'theuntoldphrase@gmail.com'

/**
 * Submit via FormSubmit.co AJAX → theuntoldphrase@gmail.com
 * First submission may require confirming that inbox once.
 */
export async function submitForm({ subject, fields }) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(FORM_EMAIL)}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...fields,
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === 'false' || data.success === false) {
    throw new Error(
      data.message ||
        'Could not send right now. Please try again or DM us on Instagram.'
    )
  }
  return 'formsubmit'
}

/** @deprecated use submitForm */
export async function submitViaFormOrMailto(args) {
  return submitForm(args)
}
