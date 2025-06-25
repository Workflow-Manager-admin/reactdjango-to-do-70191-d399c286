#!/bin/bash
cd /home/kavia/workspace/code-generation/reactdjango-to-do-70191-d399c286/todo_frontend_workspace/todo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

