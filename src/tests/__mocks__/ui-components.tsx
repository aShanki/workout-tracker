import React from 'react';

export const Button = ({ children, ...props }: any) => (
  <button {...props}>{children}</button>
);

export const Input = (props: any) => <input {...props} />;

export const Form = ({ children, ...props }: any) => (
  <form {...props}>{children}</form>
);

export const FormField = ({ render }: any) => render({ field: {} });

export const FormItem = ({ children }: any) => <div>{children}</div>;

export const FormLabel = ({ children }: any) => <label>{children}</label>;

export const FormControl = ({ children }: any) => <div>{children}</div>;

export const FormMessage = () => null;
