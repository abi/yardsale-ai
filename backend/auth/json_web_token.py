from dataclasses import dataclass
from typing import Any

import jwt
from dotenv import load_dotenv
from auth.custom_exceptions import BadCredentialsException, UnableCredentialsException
from config import CLERK_DOMAIN

load_dotenv()


@dataclass
class JsonWebToken:
    """Perform JSON Web Token (JWT) validation using PyJWT"""

    jwt_access_token: str
    issuer_url: str = f"https://{CLERK_DOMAIN}"
    algorithm: str = "RS256"
    jwks_uri: str = f"{issuer_url}/.well-known/jwks.json"

    def validate(self):
        try:
            jwks_client = jwt.PyJWKClient(self.jwks_uri)
            jwt_signing_key: Any = jwks_client.get_signing_key_from_jwt(
                self.jwt_access_token
            ).key  # type: ignore

            payload = jwt.decode(  # type: ignore
                self.jwt_access_token,
                jwt_signing_key,
                algorithms=[self.algorithm],
                issuer=self.issuer_url,
            )
        except jwt.exceptions.PyJWKClientError:
            raise UnableCredentialsException
        except jwt.exceptions.InvalidTokenError:
            raise BadCredentialsException

        return payload
