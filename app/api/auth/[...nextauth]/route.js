import passport from "passport";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

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
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const { name, email, image, id } = user;
      console.log("user", user);
      console.log("account", account);

      if (account.provider === "google")
        try {
          await connectMongoDB();

          const existingUser = await User.findOne({ email });
          if (!existingUser) {
            const newUser = await User.create({
              name: name,
              email,
              image,
              googleId: id,
            });

            const created = await newUser.save();
            console.log("creted user", created);
          } else {
            console.error(
              `Error logging in: ${res.status} ${await res.text()}`
            );
          }
        } catch (error) {
          console.error("Exception Error:", error);
        }
      return user;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/account",
  },
  debug: true,
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
