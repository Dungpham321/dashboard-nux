const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

export function encodeBase64(input:any) {
  const utf8Bytes = new TextEncoder().encode(input)
  let binary = ""
  utf8Bytes.forEach(byte => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)

}