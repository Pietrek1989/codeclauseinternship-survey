import { verifyAccessToken } from "./jwtTokens.js";

export const jwtAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    NextResponse.json((401, "No bearer token provided. 🐻"));
  } else {
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    try {
      const payload = await verifyAccessToken(accessToken);
      req.user = { _id: payload._id, role: payload.role };
      next();
    } catch (error) {
      console.log("error?", error);
      NextResponse.json((401, "Invalid token."));
    }
  }
};
