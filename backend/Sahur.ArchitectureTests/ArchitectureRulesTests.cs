using NetArchTest.Rules;
using Sahur.Domain.Entities;
using Xunit;
namespace Sahur.ArchitectureTests;
public sealed class ArchitectureRulesTests
{
    [Theory]
    [InlineData("Sahur.Infrastructure")]
    [InlineData("Sahur.Application")]
    [InlineData("Sahur.Api")]
    [InlineData("Microsoft.EntityFrameworkCore")]
    [InlineData("MediatR")]
    public void Domain_Must_Not_Depend_On_Outer_Layers(string forbiddenNamespace)
    {
        var result = Types.InAssembly(typeof(AuditEntry).Assembly).ShouldNot().HaveDependencyOn(forbiddenNamespace).GetResult();
        Assert.True(result.IsSuccessful);
    }

    [Theory]
    [InlineData("Sahur.Infrastructure")]
    [InlineData("Sahur.Api")]
    public void Application_Must_Not_Depend_On_Outer_Layers(string forbiddenNamespace)
    {
        var assembly = typeof(Sahur.Application.DependencyInjection).Assembly;
        var result = Types.InAssembly(assembly).ShouldNot().HaveDependencyOn(forbiddenNamespace).GetResult();
        Assert.True(result.IsSuccessful);
    }

    [Fact]
    public void Controllers_Must_Not_Depend_On_Infrastructure()
    {
        var assembly = typeof(Sahur.Api.Controllers.ProductsController).Assembly;
        var result = Types.InAssembly(assembly).That().ResideInNamespace("Sahur.Api.Controllers").ShouldNot().HaveDependencyOn("Sahur.Infrastructure").GetResult();
        Assert.True(result.IsSuccessful);
    }
}
