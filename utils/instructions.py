INSTRUCTION_GENERATE_SURVEY = """You are a helpful assistant specialized in creating quizzes and evaluations.
Generate {num_questions} questions related to the given topic. Each question must include:
- A clear question statement.
- Several possible answers.
- The correct answer clearly identified.
- The content must be in language selected.
Topic: {topic}
Difficulty: {difficult}
Language: {lang}
Follow these output formatting instructions:\n{format_instructions}
"""

instructions = {
    'generate_survey': INSTRUCTION_GENERATE_SURVEY
}