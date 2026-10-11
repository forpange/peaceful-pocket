import { createFileRoute } from "@tanstack/react-router";
import QuizPopApp from "../quizpop/QuizPopApp";

export const Route = createFileRoute("/")({
  component: QuizPopHome,
});

function QuizPopHome() {
  return <QuizPopApp />;
}
