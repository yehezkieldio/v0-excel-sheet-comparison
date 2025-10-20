"use client"

import React, { Component, type ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary component to catch and handle React errors gracefully
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo)
    }

    // Here you could send to error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-lg w-full p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">
                  An unexpected error occurred. Please try refreshing the page or contact support if the problem
                  persists.
                </p>
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mt-4 p-3 bg-muted rounded-md text-sm font-mono">
                    <summary className="cursor-pointer font-sans font-semibold mb-2">Error Details</summary>
                    <pre className="whitespace-pre-wrap break-words">{this.state.error.toString()}</pre>
                    {this.state.error.stack && (
                      <pre className="mt-2 whitespace-pre-wrap break-words text-xs opacity-70">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </details>
                )}
                <Button onClick={this.handleReset} className="mt-4">
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
