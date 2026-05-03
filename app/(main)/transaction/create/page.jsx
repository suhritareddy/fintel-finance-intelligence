import { getUserAccounts } from '@/actions/dashboard'
import React from 'react'
import AddTransactionForm from '../_components/transaction-form';
import { defaultCategories } from '@/data/categories';

const AddTransactionPage = async() => {
  const accounts =  await getUserAccounts();
  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4 md:mb-5 leading-tight">Add Transaction</h1>
      <AddTransactionForm accounts={accounts} categories={defaultCategories}/>
    </div>
  )
}

export default AddTransactionPage
