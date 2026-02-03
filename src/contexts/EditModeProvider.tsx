import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface EditModeContextType {
  isEditModeEnabled: boolean
  toggleEditMode: () => void
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined)

export function EditModeProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available, otherwise default to false
  const [isEditModeEnabled, setIsEditModeEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('editModeEnabled')
      return saved === 'true'
    }
    return false
  })

  // Save to localStorage whenever edit mode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('editModeEnabled', String(isEditModeEnabled))
    }
  }, [isEditModeEnabled])
  const toggleEditMode = () => {
    setIsEditModeEnabled(prev => !prev)
  }

  return (
    <EditModeContext.Provider value={{ isEditModeEnabled, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  const context = useContext(EditModeContext)
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider')
  }
  return context
}

