# OnionReel Config Layer (v1)

Goal: per-client settings + reusable templates.

## Structure
- `config/clients/<clientId>.json`
- `config/templates/` (future)

## client config fields (v1)
```json
{
  "clientId": "maxcontrax",
  "brand": {
    "bg": "#0B0B0B",
    "fg": "#FFFFFF",
    "accent": "#E17B3B"
  },
  "autoedit": {
    "soraModel": "sora-2-pro",
    "defaultProjectId": "maxcontrax-reel-v1"
  }
}
```
