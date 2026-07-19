import 'package:flutter/material.dart';

class CustomCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final Color? color;
  final BorderSide? borderSide;

  const CustomCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.color,
    this.borderSide,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cardWidget = Container(
      padding: padding ?? const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color ?? theme.cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: borderSide?.color ?? theme.colorScheme.outline,
          width: borderSide?.width ?? 1,
        ),
      ),
      child: child,
    );

    if (onTap != null) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: cardWidget,
      );
    }

    return cardWidget;
  }
}
