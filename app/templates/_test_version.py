#!/usr/bin/env python
# coding: utf-8
from preggy import expect

from <%= package.pythonName %> import __version__
from tests.base import TestCase


class VersionTestCase(TestCase):
    def test_has_proper_version(self):
        expect(__version__).to_equal('<%= package.version %>')
