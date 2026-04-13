import requests
import uuid

TOKEN = "TEST-5105167611425560-011014-07dfde35e8d4b6f275def8ec6dc6c8a7-220387854"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
}

# Paso 1: crear token de tarjeta
card_token_res = requests.post(
    "https://api.mercadopago.com/v1/card_tokens",
    headers=HEADERS,
    json={
        "card_number": "4509953566233704",
        "expiration_year": 2027,
        "expiration_month": 11,
        "security_code": "123",
        "cardholder": {
            "name": "APRO",
            "identification": {"type": "DNI", "number": "12345678"},
        },
    },
)

if card_token_res.status_code not in (200, 201):
    print("Error creando card token:", card_token_res.text)
    exit(1)

print(f"Card token: {card_token_res.json()['id']}")

CARD_DATA = {
    "card_number": "4509953566233704",
    "expiration_year": 2027,
    "expiration_month": 11,
    "security_code": "123",
    "cardholder": {
        "name": "APRO",
        "identification": {"type": "DNI", "number": "12345678"},
    },
}

def nuevo_token():
    r = requests.post("https://api.mercadopago.com/v1/card_tokens", headers=HEADERS, json=CARD_DATA)
    return r.json()["id"]

pagos = [
    {"monto": 12000, "descripcion": "Proyecto web cliente"},
    {"monto": 3500,  "descripcion": "Consultoría técnica"},
    {"monto": 8000,  "descripcion": "Desarrollo app mobile"},
    {"monto": 2000,  "descripcion": "Mantenimiento mensual"},
]

for p in pagos:
    card_token = nuevo_token()
    pago_headers = {**HEADERS, "X-Idempotency-Key": str(uuid.uuid4())}
    res = requests.post(
        "https://api.mercadopago.com/v1/payments",
        headers=pago_headers,
        json={
            "transaction_amount": p["monto"],
            "token": card_token,
            "description": p["descripcion"],
            "installments": 1,
            "payment_method_id": "visa",
            "payer": {"email": "comprador_test@test.com"},
        },
    )
    data = res.json()
    status = data.get("status", "error")
    pid = data.get("id", "-")
    print(f"  ${p['monto']:>6} | {status:>10} | id={pid} | {p['descripcion']}")
    if status == 400 or pid == "-":
        print(f"    ERROR: {data}")

print("\nListo. Sincronizá desde el dashboard.")
