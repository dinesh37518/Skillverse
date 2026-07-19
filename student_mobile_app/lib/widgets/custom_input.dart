import 'package:flutter/material.dart';

class CustomInput extends StatelessWidget {
  final String labelText;
  final TextEditingController controller;
  final IconData prefixIcon;
  final bool obscureText;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final Widget? suffixIcon;

  const CustomInput({
    super.key,
    required this.labelText,
    required this.controller,
    required this.prefixIcon,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.suffixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      validator: validator,
      style: const TextStyle(fontSize: 15),
      decoration: InputDecoration(
        labelText: labelText,
        prefixIcon: Icon(prefixIcon, size: 20),
        suffixIcon: suffixIcon,
      ),
    );
  }
}
