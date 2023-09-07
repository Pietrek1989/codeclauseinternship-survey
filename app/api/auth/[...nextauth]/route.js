import passport from "passport";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });
          console.log(email, password, user);

          if (!user) {
            console.log("no email found");
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            console.log("password dont match");
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// usersRouter.get(
//   "/googlelogin",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// usersRouter.get(
//   "/googlecallback",
//   passport.authenticate("google", { session: false }),
//   (req, res, next) => {
//     try {
//       res.redirect(
//         `${process.env.FE_URL}/?accessToken=${req.user.accessToken}&refreshToken=${req.user.refreshToken}`
//       );
//     } catch (error) {
//       next(error);
//     }
//   }
// );
