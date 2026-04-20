# EventHub (AI Event Organiser)

EventHub is a modern, full-stack event management and organization platform powered by Artificial Intelligence. It allows users to effortlessly create, manage, and explore events. With integrated AI, generating event descriptions, details, and dynamic imagery is just a click away.

## 🚀 Key Features

- **AI Event Generation**: Leverage the power of Google's Generative AI (Gemini) to automatically draft event descriptions and content.
- **Real-Time Data Backend**: Built on top of Convex for real-time application state management and seamless database syncing. 
- **Secure Authentication**: Robust user authentication (Sign-in/Sign-up) and session management handled natively by Clerk.
- **Ticketing & QR Codes**: Integrated QR code generation (`react-qr-code`) and scanning (`html5-qrcode`) for digital tickets, ensuring smooth attendee check-ins.
- **Beautiful UI Component system**: Modern, fully responsive, and accessible user interface crafted meticulously using Tailwind CSS and Radix UI components.
- **Image Integration**: Seamless integration with the Unsplash API for retrieving beautiful, relevant event cover banners.
- **Dark/Light Mode**: Full support for user-preferred theme toggling via `next-themes`.

## 💻 Tech Stack

- **Frontend/Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, React 19)
- **Database & Backend**: [Convex](https://www.convex.dev/)
- **Authentication Engine**: [Clerk](https://clerk.com/)
- **AI Integrations**: [Google Generative AI SDK](https://ai.google.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Headless UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Form Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Hosting / Analytics**: [Vercel](https://vercel.com/) / Vercel Analytics

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/en) installed on your machine.

### Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd eventhub
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory and provide the necessary keys. You will need to extract your API keys from Clerk, Convex, Unsplash, and Google MakerSuite (Gemini).

   ```env
   # Convex Deployment (Generated after running npx convex dev)
   CONVEX_DEPLOYMENT=
   NEXT_PUBLIC_CONVEX_URL=

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   CLERK_JWT_ISSUER_DOMAIN=

   # Unsplash API (For Event Banner Images)
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=

   # Google Generative AI SDK (Gemini)
   GEMINI_API_KEY=
   ```

4. **Initialize backend and run development servers**:
   Open up two terminal windows to run both the frontend and backend servers.

   Terminal 1 (Start the Convex backend):
   ```bash
   npx convex dev
   ```

   Terminal 2 (Start Next.js frontend):
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result and start interacting!

## 📁 Core Project Structure

- `/app` - Next.js App Router implementations including main routes like `/explore`, `/create-event`, `/my-events`, and `/my-tickets`.
- `/components` - Reusable presentational components (buttons, dialogs, forms, layout elements).
- `/convex` - Convex backend schema definitions, mutation handlers, and querying logic.
- `/lib` - Application utilities, library wrappers, and configuration setup functions.
- `/hooks` - Custom React hooks providing shared logic (e.g. data hydration wrapper hooks) globally.
