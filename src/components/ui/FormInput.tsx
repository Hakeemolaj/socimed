'use client'

import React, { useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'

interface FormInputProps {
  id: string
  name: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  helperText?: string
  autoComplete?: string
}

export default function FormInput({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  helperText,
  autoComplete,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    if (onBlur) onBlur(e)
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
        <input
          id={id}
          name={name}
          type={type}
          className={`w-full rounded-lg bg-slate-700/50 px-3 py-2 text-gray-100 
            placeholder-gray-400 ring-1 transition-all focus:outline-none focus:ring-2
            ${error ? 'ring-red-500 focus:ring-red-500' : 'ring-white/10 focus:ring-blue-500'} 
            ${disabled ? 'cursor-not-allowed opacity-60' : ''}
            ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          autoComplete={autoComplete}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p
          id={error ? `${id}-error` : `${id}-helper`}
          className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-400'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
} 