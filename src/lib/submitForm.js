import site from '../content/site.json'

const FORM_EMAIL = site.email || 'theuntoldphrase@gmail.com'

/**
 * Prefer FormSubmit’s permanent form ID (from the Activate email) over the raw
 * Gmail address — using only the email often re-triggers “needs activation”.
 * Set VITE_FORMSUBMIT_ID in .env (and Vercel) once you have it.
 */
const FORM_ENDPOINT =
  import.meta.env.VITE_FORMSUBMIT_ID?.trim() ||
  site.formSubmitId?.trim() ||
  FORM_EMAIL

const ACTIVATE_HINT =
  'FormSubmit still needs the permanent form ID. Open the Activate email in theuntoldphrase@gmail.com — copy the long random code (or the ID in the activate link) into .env as VITE_FORMSUBMIT_ID, restart the app, then try again. One ID covers Enquiry, Submit, Feedback, and Anonymous.'

function looksLikeActivation(data = {}) {
  const msg = String(data.message || data.error || '').toLowerCase()
  return (
    msg.includes('activat') ||
    msg.includes('confirm') ||
    msg.includes('check your email')
  )
}

/**
 * Submit via FormSubmit.co AJAX → theuntoldphrase@gmail.com
 */
export async function submitForm({ subject, fields }) {
  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(FORM_ENDPOINT)}`,
    {
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
    }
  )

  const data = await res.json().catch(() => ({}))

  if (looksLikeActivation(data)) {
    throw new Error(ACTIVATE_HINT)
  }

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
