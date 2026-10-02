import QRCodeStyling from 'qr-code-styling'

type ContentType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'sms' | 'phone' | 'whatsapp' | 'location' | 'event'

const contentTypes: Array<{ value: ContentType; label: string }> = [
  { value: 'url', label: 'Website URL' }, { value: 'text', label: 'Plain text' },
  { value: 'wifi', label: 'Wi-Fi network' }, { value: 'vcard', label: 'Contact card' },
  { value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS message' },
  { value: 'phone', label: 'Phone number' }, { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'location', label: 'Map location' }, { value: 'event', label: 'Calendar event' },
]

const typeFields: Record<ContentType, string> = {
  url: `<label class="field"><span>Website address</span><input name="url" type="url" value="https://example.com" placeholder="https://example.com" autocomplete="url" required></label>`,
  text: `<label class="field"><span>Your text</span><textarea name="text" rows="4" placeholder="Write anything you want to share" required></textarea></label>`,
  wifi: `<div class="field-row"><label class="field"><span>Network name</span><input name="ssid" value="Guest Wi-Fi" autocomplete="off" required></label><label class="field"><span>Security</span><select name="security"><option value="WPA">WPA / WPA2</option><option value="WEP">WEP</option><option value="nopass">No password</option></select></label></div><label class="field"><span>Password</span><input name="password" type="password" autocomplete="new-password"></label><label class="check-line"><input name="hidden" type="checkbox"><span>Hidden network</span></label>`,
  vcard: `<div class="field-row"><label class="field"><span>First name</span><input name="firstName" autocomplete="given-name"></label><label class="field"><span>Last name</span><input name="lastName" autocomplete="family-name"></label></div><label class="field"><span>Organization</span><input name="organization" autocomplete="organization"></label><div class="field-row"><label class="field"><span>Phone</span><input name="contactPhone" type="tel" autocomplete="tel"></label><label class="field"><span>Email</span><input name="contactEmail" type="email" autocomplete="email"></label></div><label class="field"><span>Website</span><input name="website" type="url" placeholder="https://"></label>`,
  email: `<label class="field"><span>Email address</span><input name="emailAddress" type="email" placeholder="hello@example.com" required></label><label class="field"><span>Subject</span><input name="subject" placeholder="(optional)"></label><label class="field"><span>Message</span><textarea name="emailMessage" rows="3" placeholder="(optional)"></textarea></label>`,
  sms: `<label class="field"><span>Phone number</span><input name="smsNumber" type="tel" placeholder="+1 555 123 4567" required></label><label class="field"><span>Message</span><textarea name="smsMessage" rows="3" placeholder="(optional)"></textarea></label>`,
  phone: `<label class="field"><span>Phone number</span><input name="phoneNumber" type="tel" placeholder="+1 555 123 4567" required></label>`,
  whatsapp: `<label class="field"><span>WhatsApp number</span><input name="whatsappNumber" type="tel" placeholder="15551234567" required><small>Include country code, without + or spaces.</small></label><label class="field"><span>Prefilled message</span><textarea name="whatsappMessage" rows="3" placeholder="(optional)"></textarea></label>`,
  location: `<div class="field-row"><label class="field"><span>Latitude</span><input name="latitude" type="number" min="-90" max="90" step="any" placeholder="37.7749" required></label><label class="field"><span>Longitude</span><input name="longitude" type="number" min="-180" max="180" step="any" placeholder="-122.4194" required></label></div><small>Find coordinates in your map app, then paste them here.</small>`,
  event: `<label class="field"><span>Event title</span><input name="eventTitle" placeholder="Team meetup" required></label><div class="field-row"><label class="field"><span>Starts</span><input name="eventStart" type="datetime-local" required></label><label class="field"><span>Ends</span><input name="eventEnd" type="datetime-local" required></label></div><label class="field"><span>Location</span><input name="eventLocation" placeholder="(optional)"></label>`,
}

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="/" aria-label="QuickQR home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span>quick<span>qr</span></span></a>
    <div class="privacy-note"><span class="privacy-dot"></span> Generated on your device</div>
  </header>
  <main>
    <section class="intro" aria-labelledby="page-title">
      <div class="eyebrow"><span>FREE FOREVER</span><span class="eyebrow-rule"></span><span>NO ACCOUNT NEEDED</span></div>
      <h1 id="page-title">A QR code for <em>anything.</em></h1>
      <p>Make a code, make it yours, and take it anywhere. No expiry. No watermark.</p>
    </section>
    <section class="workspace" aria-label="QR code generator">
      <div class="editor-panel">
        <div class="panel-heading"><span class="step-index">01</span><h2>Your content</h2></div>
        <label class="field type-field"><span>Content type</span><select id="content-type">${contentTypes.map((type) => `<option value="${type.value}">${type.label}</option>`).join('')}</select></label>
        <form id="content-form" novalidate></form>
        <div class="section-divider"></div>
        <div class="panel-heading style-heading"><span class="step-index">02</span><h2>Make it yours</h2></div>
        <div class="field-row color-row">
          <label class="field color-field"><span>Code color</span><span class="color-input-wrap"><input id="foreground" type="color" value="#172b27"><output for="foreground">#172B27</output></span></label>
          <label class="field color-field"><span>Background</span><span class="color-input-wrap"><input id="background" type="color" value="#ffffff"><output for="background">#FFFFFF</output></span></label>
        </div>
        <label class="check-line transparent-line"><input id="transparent" type="checkbox"><span>Transparent background</span></label>
        <div class="field-row style-selects">
          <label class="field"><span>Dot style</span><select id="dot-style"><option value="square">Square</option><option value="rounded">Rounded</option><option value="dots">Dots</option><option value="classy">Classy</option><option value="classy-rounded">Soft classy</option></select></label>
          <label class="field"><span>Corner style</span><select id="corner-style"><option value="extra-rounded">Rounded</option><option value="square">Square</option><option value="dot">Dot</option></select></label>
        </div>
        <div class="field-row correction-row">
          <label class="field"><span>Error correction</span><select id="correction"><option value="M">Medium (recommended)</option><option value="L">Low</option><option value="Q">Quartile</option><option value="H">High</option></select></label>
          <label class="field size-field"><span>Export size <output id="size-value">512 px</output></span><input id="size" type="range" min="256" max="1024" step="128" value="512"></label>
        </div>
        <div class="field logo-field">
          <span>Logo <small class="optional">OPTIONAL</small></span>
          <div class="logo-row"><label class="upload-button" for="logo-upload">Choose image</label><input id="logo-upload" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"><span id="logo-name">No logo selected</span><button id="remove-logo" class="text-button" type="button" hidden>Remove</button></div>
        </div>
        <p id="scan-warning" class="scan-warning" role="status" hidden></p>
      </div>
      <aside class="preview-panel" aria-label="Live QR code preview">
        <div class="preview-topline"><div class="panel-heading"><span class="step-index">03</span><h2>Your QR code</h2></div><span class="live-indicator"><i></i> LIVE</span></div>
        <div id="preview-frame" class="preview-frame"><div id="qr-output" class="qr-output"></div><div id="empty-preview" class="empty-preview" hidden><span class="empty-icon" aria-hidden="true">+</span><span>Add content to see your code</span></div></div>
        <p id="contrast-warning" class="contrast-warning" role="status" hidden></p>
        <div class="download-row"><button id="download-png" class="download-button primary-download" type="button"><span class="download-icon" aria-hidden="true">↓</span> PNG</button><button id="download-svg" class="download-button" type="button"><span class="download-icon" aria-hidden="true">↓</span> SVG</button></div>
        <p class="download-note">High-resolution · No watermark</p>
        <div class="preview-footer"><span class="privacy-lock" aria-hidden="true">●</span><span>Your content never leaves this device.</span></div>
      </aside>
    </section>
    <section class="trust-strip" aria-label="QuickQR features"><div><span class="trust-icon">01</span><span>Free, always</span></div><div><span class="trust-icon">02</span><span>Static codes never expire</span></div><div><span class="trust-icon">03</span><span>No signup. No tracking.</span></div></section>
  </main>
  <footer><span>QuickQR</span><span>Simple codes. Yours to keep.</span></footer>
`

const contentTypeSelect = document.querySelector<HTMLSelectElement>('#content-type')!
const contentForm = document.querySelector<HTMLFormElement>('#content-form')!
const qrOutput = document.querySelector<HTMLDivElement>('#qr-output')!
const previewFrame = document.querySelector<HTMLDivElement>('#preview-frame')!
const emptyPreview = document.querySelector<HTMLDivElement>('#empty-preview')!
const foregroundInput = document.querySelector<HTMLInputElement>('#foreground')!
const backgroundInput = document.querySelector<HTMLInputElement>('#background')!
const transparentInput = document.querySelector<HTMLInputElement>('#transparent')!
const correctionSelect = document.querySelector<HTMLSelectElement>('#correction')!
const sizeInput = document.querySelector<HTMLInputElement>('#size')!
const logoUpload = document.querySelector<HTMLInputElement>('#logo-upload')!
const scanWarning = document.querySelector<HTMLParagraphElement>('#scan-warning')!
const contrastWarning = document.querySelector<HTMLParagraphElement>('#contrast-warning')!
let logoData: string | undefined
let payload = 'https://example.com'

const qrCode = new QRCodeStyling({
  width: 512, height: 512, type: 'svg', data: payload, margin: 4,
  qrOptions: { errorCorrectionLevel: 'M' },
  dotsOptions: { color: foregroundInput.value, type: 'square' },
  backgroundOptions: { color: backgroundInput.value },
  cornersSquareOptions: { color: foregroundInput.value, type: 'extra-rounded' },
  cornersDotOptions: { color: foregroundInput.value, type: 'dot' },
  imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: 0.22 },
})
qrCode.append(qrOutput)

function fieldValue(name: string): string {
  return new FormData(contentForm).get(name)?.toString().trim() ?? ''
}

function escapeWifi(value: string): string {
  return value.replaceAll('\\', '\\\\').replace(/[;,:]/g, '\\$&')
}

function escapeVcard(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,').replaceAll('\n', '\\n')
}

function compactDate(value: string): string {
  return value.replaceAll('-', '').replaceAll(':', '')
}

function buildPayload(type: ContentType): string {
  switch (type) {
    case 'url': return fieldValue('url')
    case 'text': return fieldValue('text')
    case 'wifi': {
      const security = fieldValue('security') || 'WPA'
      const password = security === 'nopass' ? '' : `P:${escapeWifi(fieldValue('password'))};`
      const hidden = contentForm.querySelector<HTMLInputElement>('input[name="hidden"]')?.checked ?? false
      return `WIFI:T:${security};S:${escapeWifi(fieldValue('ssid'))};${password}H:${hidden};;`
    }
    case 'vcard': {
      const firstName = escapeVcard(fieldValue('firstName'))
      const lastName = escapeVcard(fieldValue('lastName'))
      const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${lastName};${firstName};;;`, `FN:${[firstName, lastName].filter(Boolean).join(' ')}`]
      const optional: Array<[string, string]> = [['ORG', 'organization'], ['TEL;TYPE=CELL', 'contactPhone'], ['EMAIL', 'contactEmail'], ['URL', 'website']]
      for (const [prefix, name] of optional) {
        const value = fieldValue(name)
        if (value) lines.push(`${prefix}:${escapeVcard(value)}`)
      }
      lines.push('END:VCARD')
      return lines.join('\r\n')
    }
    case 'email': {
      const address = fieldValue('emailAddress')
      if (!address) return ''
      const query = new URLSearchParams()
      const subject = fieldValue('subject')
      const message = fieldValue('emailMessage')
      if (subject) query.set('subject', subject)
      if (message) query.set('body', message)
      return `mailto:${address}${query.size ? `?${query.toString()}` : ''}`
    }
    case 'sms': {
      const number = fieldValue('smsNumber')
      return number ? `SMSTO:${number}:${fieldValue('smsMessage')}` : ''
    }
    case 'phone': {
      const number = fieldValue('phoneNumber')
      return number ? `tel:${number}` : ''
    }
    case 'whatsapp': {
      const number = fieldValue('whatsappNumber').replace(/\D/g, '')
      if (!number) return ''
      const message = fieldValue('whatsappMessage')
      return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`
    }
    case 'location': {
      const latitude = fieldValue('latitude')
      const longitude = fieldValue('longitude')
      return latitude && longitude ? `https://maps.google.com/?q=${encodeURIComponent(`${latitude},${longitude}`)}` : ''
    }
    case 'event': {
      const title = fieldValue('eventTitle')
      const start = fieldValue('eventStart')
      const end = fieldValue('eventEnd')
      if (!title || !start || !end) return ''
      return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `SUMMARY:${escapeVcard(title)}`, `DTSTART:${compactDate(start)}`, `DTEND:${compactDate(end)}`, fieldValue('eventLocation') ? `LOCATION:${escapeVcard(fieldValue('eventLocation'))}` : '', 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n')
    }
  }
}

function relativeLuminance(hex: string): number {
  const channels = hex.match(/[\da-f]{2}/gi)?.map((channel) => parseInt(channel, 16) / 255) ?? [0, 0, 0]
  const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return 0.2126 * (linear[0] ?? 0) + 0.7152 * (linear[1] ?? 0) + 0.0722 * (linear[2] ?? 0)
}

function refreshWarnings(): void {
  const foregroundLuminance = relativeLuminance(foregroundInput.value)
  const backgroundLuminance = transparentInput.checked ? 1 : relativeLuminance(backgroundInput.value)
  const ratio = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  contrastWarning.hidden = ratio >= 4.5
  contrastWarning.textContent = ratio < 3 ? 'Low contrast may make this code difficult to scan. Choose darker code or a lighter background.' : 'For the most reliable scanning, increase the contrast between your code and background.'
  scanWarning.hidden = !logoData || correctionSelect.value === 'H'
  scanWarning.textContent = 'A logo can affect scanning. High error correction is recommended when using one.'
}

function refreshCode(): void {
  payload = buildPayload(contentTypeSelect.value as ContentType)
  const hasPayload = payload.trim().length > 0
  previewFrame.classList.toggle('is-empty', !hasPayload)
  emptyPreview.hidden = hasPayload
  if (hasPayload) {
    qrCode.update({
      data: payload,
      width: Number(sizeInput.value),
      height: Number(sizeInput.value),
      image: logoData,
      qrOptions: { errorCorrectionLevel: correctionSelect.value as 'L' | 'M' | 'Q' | 'H' },
      dotsOptions: { color: foregroundInput.value, type: document.querySelector<HTMLSelectElement>('#dot-style')!.value as 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' },
      backgroundOptions: { color: transparentInput.checked ? 'rgba(255,255,255,0)' : backgroundInput.value },
      cornersSquareOptions: { color: foregroundInput.value, type: document.querySelector<HTMLSelectElement>('#corner-style')!.value as 'square' | 'dot' | 'extra-rounded' },
      cornersDotOptions: { color: foregroundInput.value, type: 'dot' },
    })
  }
  document.querySelector<HTMLOutputElement>('#size-value')!.value = `${sizeInput.value} px`
  document.querySelector<HTMLOutputElement>('[for="foreground"]')!.value = foregroundInput.value.toUpperCase()
  document.querySelector<HTMLOutputElement>('[for="background"]')!.value = backgroundInput.value.toUpperCase()
  backgroundInput.disabled = transparentInput.checked
  refreshWarnings()
}

function renderFields(): void {
  contentForm.innerHTML = typeFields[contentTypeSelect.value as ContentType]
  refreshCode()
}

contentTypeSelect.addEventListener('change', renderFields)
contentForm.addEventListener('input', refreshCode)
contentForm.addEventListener('change', refreshCode)
for (const selector of ['#foreground', '#background', '#transparent', '#dot-style', '#corner-style', '#correction', '#size']) {
  const control = document.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!
  control.addEventListener('input', refreshCode)
  control.addEventListener('change', refreshCode)
}

logoUpload.addEventListener('change', () => {
  const file = logoUpload.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    logoData = typeof reader.result === 'string' ? reader.result : undefined
    document.querySelector<HTMLSpanElement>('#logo-name')!.textContent = file.name
    document.querySelector<HTMLButtonElement>('#remove-logo')!.hidden = !logoData
    refreshCode()
  })
  reader.readAsDataURL(file)
})

document.querySelector<HTMLButtonElement>('#remove-logo')!.addEventListener('click', () => {
  logoData = undefined
  logoUpload.value = ''
  document.querySelector<HTMLSpanElement>('#logo-name')!.textContent = 'No logo selected'
  document.querySelector<HTMLButtonElement>('#remove-logo')!.hidden = true
  refreshCode()
})
document.querySelector<HTMLButtonElement>('#download-png')!.addEventListener('click', () => {
  if (payload.trim()) void qrCode.download({ name: 'quickqr-code', extension: 'png' })
})
document.querySelector<HTMLButtonElement>('#download-svg')!.addEventListener('click', () => {
  if (payload.trim()) void qrCode.download({ name: 'quickqr-code', extension: 'svg' })
})

renderFields()