'use client'

import React, { useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'

interface TextAreaProps {
  id: string
  name: string
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  helperText?: string
  rows?: number
  maxLength?: number
}

export default function TextArea({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  helperText,
  rows = 3,
  maxLength,
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [charCount, setCharCount] = useState(value.length)

  const handleFocus = () => setIsFocused(true)
  
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    if (onBlur) onBlur(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length)
    onChange(e)
  }

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-gray-200"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          id={id}
          name={name}
          className={`w-full resize-none rounded-lg bg-slate-700/50 px-3 py-2 text-gray-100 
            placeholder-gray-400 ring-1 transition-all focus:outline-none focus:ring-2
            ${error ? 'ring-red-500 focus:ring-red-500' : 'ring-white/10 focus:ring-blue-500'} 
            ${disabled ? 'cursor-not-allowed opacity-60' : ''}
            ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        />
        {error && (
          <div className="pointer-events-none absolute top-2 right-2 flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between">
        {(error || helperText) && (
          <p
            id={error ? `${id}-error` : `${id}-helper`}
            className={`text-sm ${error ? 'text-red-500' : 'text-gray-400'}`}
          >
            {error || helperText}
          </p>
        )}
        {maxLength && (
          <p 
            className={`text-xs ${
              charCount > maxLength * 0.9 
                ? charCount >= maxLength 
                  ? 'text-red-500' 
                  : 'text-yellow-500' 
                : 'text-gray-400'
            }`}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
} 