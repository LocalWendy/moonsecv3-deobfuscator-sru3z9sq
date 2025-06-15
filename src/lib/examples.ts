// Example obfuscated code samples for testing the deobfuscator

export const EXAMPLE_CODES = {
  simple: `local a1b2c3 = "\\72\\101\\108\\108\\111"
local d4e5f6 = function(g7h8i9) 
  return g7h8i9 + 1 
end
local j0k1l2 = d4e5f6(5)
print(a1b2c3 .. " " .. tostring(j0k1l2))`,

  medium: `local a123456 = {}
local b789012 = function(c345678, d901234)
  local e567890 = c345678 * 2 + 0
  if e567890 > 10 then
    return d901234 .. "\\87\\111\\114\\108\\100"
  else
    return "\\70\\97\\105\\108"
  end
end
for f234567 = 1, 10 do
  a123456[f234567] = b789012(f234567, "\\72\\101\\108\\108\\111")
end`,

  complex: `local x9f3a2b = loadstring("\\114\\101\\116\\117\\114\\110\\32\\102\\117\\110\\99\\116\\105\\111\\110\\40\\97\\44\\98\\41\\32\\114\\101\\116\\117\\114\\110\\32\\97\\43\\98\\32\\101\\110\\100")()
local y8e2d1c = {["\\107\\101\\121\\49"] = "\\118\\97\\108\\117\\101\\49", ["\\107\\101\\121\\50"] = "\\118\\97\\108\\117\\101\\50"}
local z7d1f2e = function(w6c0e3f, v5b9d4g, u4a8c5h)
  local t3z7b6i = w6c0e3f(v5b9d4g, u4a8c5h)
  return t3z7b6i * 1
end
local s2y6a7j = z7d1f2e(x9f3a2b, 5, 3)
for k1x5z8l, m0w4y9n in pairs(y8e2d1c) do
  print(k1x5z8l, m0w4y9n, s2y6a7j)
end`
};

export const EXAMPLE_DESCRIPTIONS = {
  simple: "Basic variable renaming and string decoding",
  medium: "Function analysis with loops and conditionals", 
  complex: "Advanced obfuscation with loadstring and tables"
};